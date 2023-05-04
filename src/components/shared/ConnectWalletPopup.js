import { Popconfirm } from "antd";

const ConnectWalletPopup = (props) => {
  return (
    <Popconfirm
      placement={props.placement ? props.placement : "bottom"}
      title={"Wallet not found. Try Metamask?"}
      showCancel={false}
      // description={"Try metamask?"}
      okText={
        <a href="https://metamask.io/" target="_blank" rel="noreferrer">
          Lets Go!
        </a>
      }
    >
      Connect Wallet
    </Popconfirm>
  );
};
export default ConnectWalletPopup;
