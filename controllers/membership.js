// controllers/someController.js
exports.viewOppositePage = (req, res) => {
    res.json({ message: 'Opposite page viewed' });
  };
  
  exports.useCommunity = (req, res) => {
    res.json({ message: 'Community accessed' });
  };
  
  exports.follow = (req, res) => {
    res.json({ message: 'Followed successfully' });
  };
  
  exports.postOnOppositePage = (req, res) => {
    res.json({ message: 'Post created on opposite page' });
  };
  