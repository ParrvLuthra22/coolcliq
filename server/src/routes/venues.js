import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { distanceMeters } from '../utils/geo.js';

const router = Router();

// ----- GET /api/venues/nearby?lat=&lng=&radius= -----
// Returns active venues with live counts + demographic breakdown
router.get('/nearby', requireAuth, async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius || 5000); // metres

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'lat & lng required' });
    }

    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      include: {
        presences: {
          where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
          select: { user: { select: { gender: true, age: true } } },
        },
      },
    });

    const filtered = venues
      .map(v => {
        const dist = distanceMeters(lat, lng, v.latitude, v.longitude);
        const counts = { MALE: 0, FEMALE: 0, NON_BINARY: 0, PREFER_NOT_TO_SAY: 0 };
        v.presences.forEach(p => { counts[p.user.gender]++; });
        return {
          id: v.id,
          name: v.name,
          address: v.address,
          city: v.city,
          latitude: v.latitude,
          longitude: v.longitude,
          coverImageUrl: v.coverImageUrl,
          distanceMeters: Math.round(dist),
          activeCount: v.presences.length,
          demographics: counts,
        };
      })
      .filter(v => v.distanceMeters <= radius)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    res.json({ venues: filtered });
  } catch (e) { next(e); }
});

// ----- GET /api/venues/:id -----
// Active people at a venue (anonymous handles only)
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: req.params.id },
      include: {
        presences: {
          where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
          include: { user: { select: { id: true, handle: true, gender: true, age: true, photoUrl: true } } },
        },
      },
    });
    if (!venue || !venue.isActive) return res.status(404).json({ error: 'Venue not found' });

    // Hide table numbers; expose only public profile fields
    const activeUsers = venue.presences
      .filter(p => p.userId !== req.userId)
      .map(p => ({
        userId: p.user.id,
        handle: p.user.handle,
        gender: p.user.gender,
        age: p.user.age,
        photoUrl: p.user.photoUrl,
      }));

    res.json({
      venue: {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        coverImageUrl: venue.coverImageUrl,
      },
      activeUsers,
    });
  } catch (e) { next(e); }
});

export default router;
