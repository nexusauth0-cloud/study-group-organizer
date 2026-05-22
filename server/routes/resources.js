const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getResources, uploadResource, updateResource, deleteResource, incrementDownload,
} = require('../controllers/resourceController');

router.get('/', protect, getResources);
router.post('/', protect, upload.single('file'), uploadResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.post('/:id/download', protect, incrementDownload);

module.exports = router;
