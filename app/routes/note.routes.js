const { authJwt } = require('../middleware');
const notesController = require('../controllers/notes.controller');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.get('/api/user/notes', [authJwt.verifyToken], notesController.get_notes);
  app.get('/api/user/notes/:id', notesController.get_single_note);
  app.post('/api/user/notes', [authJwt.verifyToken], notesController.add_note);
  app.patch('/api/user/notes/:id', [authJwt.verifyToken], notesController.update_note);
  app.delete('/api/user/notes/:id', [authJwt.verifyToken], notesController.delete_note);
};
