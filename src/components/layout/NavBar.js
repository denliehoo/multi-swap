// import classes from "./NavBar.module.css";
import { Menu, Row, Col } from "antd";

// import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const NavBar = () => {
    const middleItems = [
        { label: 'Swap', key: 'swap' },
        {
            label: 'DAO',
            key: 'daoMenu',
            children: [{ label: 'Vote', key: 'daoVote' }, { label: 'Forum', key: 'daoForum' }],
        },
        {
            label: 'More',
            key: 'moreMenu',
            children: [{ label: 'Documentation', key: 'moreDocumentation' }],
        },
        { label: 'Bridge', key: 'bridge' },
        {
            label: '[Logo] Ethereum',
            key: 'eth',
            children: [{ label: '[Logo] Fantom', key: 'ftm' }, { label: '[Logo] Avalanche', key: 'avax' }],
        },

        { label: 'Connect Wallet', key: 'item-1' },

        {
            label: 'Settings',
            key: 'settingMenu',
            children: [{ label: '[Icon] Dark mode', key: 'settingsDark' }, { label: '[Icon] Light mode', key: 'settingsLight' }],
        },

    ];


    return (

        <Row justify="center">
            <Col >
                <Menu items={middleItems} mode={"horizontal"} />
            </Col>

        </Row >

    );
};

export default NavBar;