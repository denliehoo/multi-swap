import { FC } from "react";
import { Drawer, Menu } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import classes from "./NavBar.module.css";

interface NavBarDrawerProps {
  showDrawer: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
  rightItems: any;
  width: number | undefined;
}

const NavBarDrawer: FC<NavBarDrawerProps> = ({
  showDrawer,
  closeDrawer,
  openDrawer,
  rightItems,
  width,
}) => (
  <>
    <div className={classes.hamburgerMenu} onClick={openDrawer}>
      <MenuOutlined />
    </div>
    <Drawer
      title={null}
      headerStyle={{ border: 0 }}
      placement="right"
      onClose={closeDrawer}
      visible={showDrawer}
      width={width}
      closeIcon={<CloseOutlined style={{ color: "#86C232" }} />}
    >
      <Menu items={rightItems} mode={"inline"} className={classes.antdMenu} />
    </Drawer>
  </>
);

export default NavBarDrawer;
