'use client';

import { Provider } from 'react-redux';
import { store } from '../store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// 'use client';

// import { Provider } from 'react-redux';
// import { store } from '../store';
// import { ConfigProvider } from 'antd';

// const LIGHT_GREEN = '#86c232';
// const DARK_GREEN = '#61892F';
// const BLACK = '#222629';
// const LIGHT_GREY = '#6B6E70';
// const DARK_GREY = '#474B4F';

// // https://ant.design/docs/react/customize-theme#api
// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <Provider store={store}>
//       <ConfigProvider
//         theme={{
//           token: {
//             colorBgElevated: BLACK,
//             colorPrimary: LIGHT_GREEN,
//             colorTextBase: LIGHT_GREEN,
//           },
//           components: {
//             Menu: {
//               itemBg: BLACK,
//               itemHoverColor: DARK_GREEN,
//               itemColor: LIGHT_GREEN,
//               itemActiveBg: BLACK,
//               popupBg: BLACK,
//               subMenuItemBg: BLACK,
//               subMenuItemSelectedColor: LIGHT_GREEN,
//               horizontalItemSelectedColor: 'transparent',
//               horizontalItemHoverColor: 'transparent',
//               itemHoverBg: 'transparent',
//               itemSelectedColor: 'transparent',
//             },
//             Button: {
//               defaultHoverBg: LIGHT_GREY,
//               defaultBg: 'transparent',
//               defaultActiveBg: LIGHT_GREY,
//               colorPrimary: LIGHT_GREEN,
//               colorTextBase: LIGHT_GREEN,
//               textTextColor: LIGHT_GREEN,
//               colorText: LIGHT_GREEN,
//               colorBorder: LIGHT_GREEN,
//               colorPrimaryBorder: LIGHT_GREEN,
//             },
//             Input: {
//               colorBgContainer: 'transparent',
//               colorTextPlaceholder: LIGHT_GREY,
//             },
//           },
//         }}
//       >
//         {children}
//       </ConfigProvider>
//     </Provider>
//   );
// }
