import { Router } from 'express';
import { Request, Response } from 'express';
import { Instrument } from '../models/instrument';

const router = Router();

const bell = {
  "version": "0.4.0",
  "basePitch": 440,
  "oscs": [
    {
      "modulation": [],
      "envelope": {
        "tag": "adsr",
        "attack": 0.005,
        "decay": 0.4686499999999997,
        "sustain": 0.41000000000000014,
        "release": 0.2835999999999998
      },
      "volume": -72,
      "wave": "absSine",
      "pitchFraction": [
        7,
        2
      ]
    },
    {
      "modulation": [
        78
      ],
      "envelope": {
        "tag": "adsr",
        "attack": 0.005,
        "decay": 0.6119499999999998,
        "sustain": 0,
        "release": 0.84
      },
      "volume": -17,
      "wave": "sine",
      "pitchFraction": [
        2,
        1
      ]
    }
  ],
  "title": "Bell"
}


router.get('/:id([0-9a-z]{24})', (req: Request, res: Response) => {
//router.get('/:id([0-9a-z]{24})', (req: Request, res: Response) => {
    // Instrument.findById(req.params.id, (err: Error, instrument: any) => {
    //     if (err) {
    //         res.status(500)
    //            .send(err);
    //     }
    //     res.status(200)
    //        .send(instrument);
    // });
    res.status(200).type('json').send(bell);
});

export default router;
