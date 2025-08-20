import { useDispatch, useSelector } from 'react-redux';
import { ICustomToken } from './interface';
import {
  addCustomToken,
  changeChainCustomToken,
  removeAllCustomToken,
  removeCustomToken,
} from './reducer';
import { RootState } from '@src/store';
import { EBlockchainNetwork } from '@src/enum';
import { useCallback } from 'react';

export const useCustomTokenDispatch = () => {
  const dispatch = useDispatch();

  const addCustomTokenAction = useCallback(
    (token: ICustomToken[]) => dispatch(addCustomToken(token)),
    [dispatch],
  );

  const removeCustomTokenAction = useCallback(
    (token: ICustomToken[]) => dispatch(removeCustomToken(token)),
    [dispatch],
  );

  const removeAllCustomTokenAction = useCallback(
    () => dispatch(removeAllCustomToken()),
    [dispatch],
  );

  const changeChainCustomTokenReducer = useCallback(
    (chain: EBlockchainNetwork) => dispatch(changeChainCustomToken(chain)),
    [dispatch],
  );

  return {
    addCustomTokenAction,
    removeCustomTokenAction,
    removeAllCustomTokenAction,
    changeChainCustomTokenReducer,
  };
};
export const useCustomTokenState = () => {
  return useSelector((state: RootState) => state.customTokenReducer);
};
