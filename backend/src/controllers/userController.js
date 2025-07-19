let data = [];

export const getUsers = (req, res) => {
  res.status(200).json({
    success: true,
    data,
  });
};
export const setUsers = (req, res) => {
  const { val } = req.body;

  data.push(val);
  res.status(200).json({
    success: true,
    data,
  });
};
