import { FC } from 'react';
import { Drawer, Menu } from 'antd';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import classes from './NavBar.module.css';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';

interface NavBarDrawerProps {
  showDrawer: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
  rightItems: ItemType<MenuItemType>[];
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
      styles={{ header: { border: 0 } }}
      placement="right"
      onClose={closeDrawer}
      open={showDrawer}
      width={width}
      closeIcon={<CloseOutlined style={{ color: '#86C232' }} />}
    >
      <Menu items={rightItems} mode={'inline'} className={classes.antdMenu} />
    </Drawer>
  </>
);

export default NavBarDrawer;
