const router = require("express").Router();
const { Address } = require('../../../models/Address');

module.exports = router;


router.post("/", async (req, res, next) => {
  const address = req.body;
  try {
    const newAddress = await Address.create(address);
    res.send(newAddress)
  } catch (err) {
    res.status(500);
    res.send({ success: false,  message: "Invalid address Information"})
    console.log(err)
  }
});

router.get('/:addressId', async (req, res, next) => {
  const addressId = req.params.addressId;
  try {
    const foundAddress = await Address.findById(addressId)
    const response = foundAddress 
                      ? { success: true, foundAddress }
                      : { success: false, message: "Address does not exist" }
    res.send(response);
  } catch (err) {
    next(err)
  }
})

router.delete('/:addressId', async (req, res, next) => {
  const addressId = req.params.addressId;
  try {
    const deletedAddress = await Address.findByIdAndRemove(addressId);
    const response = deletedAddress 
                      ? { success: true, deletedAddress }
                      : { success: false, message: "Address was not deleted"}
    res.send(deletedAddress);
  } catch (err) {
    console.log(err);
  }
})

// update address with a specific ID
router.put('/:addressId', async (req, res, next) => {
  const addressId = req.params.addressId;
  const data = req.body
  try {
    const updatedAddress = await Address.findByIdAndUpdate(addressId, data, { new: true })
    const response = updatedAddress 
                      ? { success: true, updatedAddress }
                      : { success: false, message: "Address failed to update" }
    res.send(updatedAddress);
  } catch (err) {
    console.log(err);
    next(err);
  }
})