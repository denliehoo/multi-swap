export const shortenAddress = (address: string | undefined) => {
  if (!address || address.length < 8) {
    return address;
  }

  return address.substring(0, 4) + "..." + address.slice(-4);
};
