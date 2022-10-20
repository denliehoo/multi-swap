// import classes from "./NavBar.module.css";
import { Menu, Row, Col } from 'antd'

// import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const NavBar = () => {
  const middleItems = [
    { label: 'Swap', key: 'swap' },
    {
      label: 'DAO',
      key: 'daoMenu',
      children: [
        { label: 'Vote', key: 'daoVote' },
        { label: 'Forum', key: 'daoForum' },
      ],
    },
  ]

  const rightItems = [
    {
      label: '[Logo] Ethereum',
      key: 'eth',
      children: [
        { label: '[Logo] Fantom', key: 'ftm' },
        { label: '[Logo] Avalanche', key: 'avax' },
      ],
    },

    { label: 'Connect Wallet', key: 'item-1' },

    {
      label: 'Settings',
      key: 'settingMenu',
      children: [
        { label: '[Icon] Dark mode', key: 'settingsDark' },
        { label: '[Icon] Light mode', key: 'settingsLight' },
      ],
    },
  ]

  return (
    <Row justify="space-between">
      <Col span={10}></Col>
      <Col span={6}>
        <Menu items={middleItems} mode={'horizontal'} />
      </Col>
      <Col>
        <Menu items={rightItems} mode={'horizontal'} />
      </Col>
    </Row>
  )
}

export default NavBar
