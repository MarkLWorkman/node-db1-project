const router = require("express").Router();
const db = require("../../data/db-config");
const middleware = require("./accounts-middleware");
const account = require("./accounts-model");

router.get("/", async (req, res, next) => {
  try {
    const accounts = await account.getAll();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", middleware.checkAccountId, async (req, res, next) => {
  try {
    const account = await account.getById(req.params.id);
    res.json(account);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  middleware.checkAccountNameUnique,
  middleware.checkAccountPayload,
  async (req, res, next) => {
    try {
      const newAccount = await account.create(req.body.trim());
      res.status(201).json(newAccount);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  middleware.checkAccountId,
  middleware.checkAccountPayload,
  async (req, res, next) => {
    try {
      const updated = await account.updateById(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", middleware.checkAccountId, async (req, res, next) => {
  try {
    await account.deleteById(req.params.id);
    res.json(req.account);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 404).json({
    message: err.message,
  });
});

module.exports = router;
