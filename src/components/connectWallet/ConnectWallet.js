import React, { useContext, useState } from 'react'
import WalletContext from '../../store/wallet-context';

// import './MetamaskLogin.css'

const MetamaskLogin = () => {
    const walletContext = useContext(WalletContext)

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log('MetaMask Here!');

            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    walletContext.setWalletAddress(result[0])
                    // const newAddress = result[0].slice(0, 5) + "..." + result[0].slice(-4)
                    // console.log(newAddress)
                    accountChangedHandler(result[0]);
                    // accountChangedHandler(newAddress);
                    // setConnButtonText('Wallet Connected');
                    setConnButtonText('');
                })
                .catch(error => {
                    setErrorMessage(error.message);

                });

        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    // update account, will cause component re-render
    const accountChangedHandler = (newAccount) => {
        walletContext.setWalletAddress(newAccount);
        // const newAddress = newAccount.slice(0, 5) + "..." + newAccount.slice(-4);
        setDefaultAccount(newAccount);


    }


    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application
        window.location.reload();
    }


    // listen for account changes
    window.ethereum.on('accountsChanged', accountChangedHandler);

    window.ethereum.on('chainChanged', chainChangedHandler);

    return (
        <React.Fragment>
            <li>
                <span><p onClick={connectWalletHandler}>{connButtonText}</p></span> <span><p>{defaultAccount}</p></span>
                {/* <div>
                <p>Address: {defaultAccount}</p>
            </div>
            {errorMessage} */}

            </li>
        </React.Fragment>
    );
}

export default MetamaskLogin;