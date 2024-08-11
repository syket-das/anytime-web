const calculateInrAmountFromUsdt = (
  usdtAmount: number,
  usdtInrRate: number
) => {
  let inrAmount = 0;

  if (usdtAmount >= 1054.64 && usdtAmount <= 2105.27) {
    inrAmount = usdtAmount * (usdtInrRate + 0.25);
  } else if (usdtAmount > 2105.27 && usdtAmount <= 3157.9) {
    inrAmount = usdtAmount * (usdtInrRate + 0.5);
  } else if (usdtAmount > 3157.9) {
    inrAmount = usdtAmount * (usdtInrRate + 1);
  } else {
    inrAmount = usdtAmount * usdtInrRate;
  }

  return inrAmount;
};

export default calculateInrAmountFromUsdt;
