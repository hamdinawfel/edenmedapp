const Participant = require('../models/participant');

const checkLientIsParticipated = (req, res, next) => {
    Participant.findOne({ email: req.body.email, eventId: req.body.eventId }).then((participant) => {
    if (!participant) {
      next();
      return;
    } else {
      res.status(500).json({
        error: 'You are already signed in for this event',
      });
    }
  });
};

module.exports = checkLientIsParticipated;