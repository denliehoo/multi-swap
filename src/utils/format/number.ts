export const formatNumber = (
  num: string | number | undefined,
  type: 'fiat' | 'crypto',
) => {
  if (num === '' || !num) {
    return 0;
  }

  if (isNaN(num as number) || num === 'NaN') {
    return 'Unable to fetch price';
  }

  const number = typeof num === 'string' ? parseFloat(num) : num;

  if (type === 'fiat') {
    return `$ ${number
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  if (type === 'crypto') {
    let formattedNumber = number.toFixed(8).toString();
    const parts = formattedNumber.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1].replace(/0+$/, '');
    if (decimalPart.length > 0) {
      formattedNumber = integerPart + '.' + decimalPart;
    } else {
      formattedNumber = integerPart;
    }
    return formattedNumber;
  }
};
