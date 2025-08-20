import { Providers } from '@src/app/providers';
import Swap from '../components/swap';

const AppPage = () => {
  return (
    <Providers>
      <div>
        <Swap />
      </div>
    </Providers>
  );
};

export default AppPage;
