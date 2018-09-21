const router = require("express").Router();
const { Coupon } = require("../../../models/Coupon");

// Firebase integration needs to available and imported at this point

module.exports = router;



// All coupon routes will be accessible only to Admins!!!!!

// Get All coupons
router.get('/', async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.send(coupons);
  } catch (err) {
    next(err);
  }
})

// Get single coupon
router.get('/:couponId', async (req, res, next) => {
  const couponId = req.params.couponId;
  try {
    const coupon = await Coupon.findById(couponId);
    res.send(coupon);
  } catch (err) {
    next(err);
  }
})

// Create coupon  
/**
 * Creating a coupon leads to a whole chain of events...
 * First the coupon has to be created
 * 
 * next the coupon's push date needs to be checked, if the date has already passed
 * or if there is none, then the coupon needs to be pushed to the users
 * 
 * else
 * 
 * The coupon is just stored, ready for a cron job to activate then push it when it's ready. . .
 * 
 * The mechanism for the cron job could literally be a find method that checks the push date
 * or possibly a separate table with the waiting coupons, the former seems easy enough to implement though
 */

// Update coupon
router.put('/:couponId', async (req, res, next) => {
  const couponId = req.params.couponId;
  const data = req.body;
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, data, { new: true });
    res.send(updatedCoupon);
  } catch (err) {
    next(err);
  }
})


// Delete coupon
router.delete('/:couponId', async (req, res, next) => {
  const couponId = req.params.couponId;
  try {
    const deletedCoupon = await Coupon.findByIdAndRemove(couponId);
    console.log(deletedCoupon);
    res.send(deletedCoupon);
  } catch (err) {
    next(err)
  }
})


/**
 * Remove many coupons Route can go here . . .
 */


// Cron jobs?