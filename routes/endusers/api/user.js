const router = require("express").Router();
const { User } = require("../../../models/User");
const passport = require("passport");

module.exports = router;

router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId)
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Update User
router.put("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const data = req.body
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data, {new: true})
    res.send(updatedUser)
  } catch (updatedUser) {
    next(err)
  }
})

router.delete("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const removedUser = await User.findByIdAndRemove(userId)
    const response = removedUser ? {success: true, message: "User Successfully Deleted."} 
                                 : {success: false, message: "User Does Not Exist."}
    res.send(response);
  } catch (err) {
    next(err)
  }
})

router.put("/:userId/redeem/:couponId", async (req, res, next) => {
  const {userId, couponId} = req.params;
  try {
    /**
     * Update user document
     * remove coupon from all coupons
     * stick it into redeemed coupons
     * Return the updated user. . . 
     * also add 1 to the redeemed field on that particular coupon. .
     */
  } catch (err) {
    next(err)
  }
})

router.put("/:userId/removeExpired/", async(res, req, next) => {
  /**
   * When the user logs in or goes into a specific view, their list of coupons will be
   * checked and any coupons passed the expiration date will be removed from their 
   * User Doc 
   * 
   * (if A coupon Id is passed into the body of this function, then that specific coupon
   * will be removed)
   */
})