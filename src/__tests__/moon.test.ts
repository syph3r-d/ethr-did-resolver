// @ts-nocheck
import { concat, getAddress, getBytes, keccak256, toBeHex, toUtf8Bytes, zeroPadValue } from 'ethers'
import MoonbeamDIDRegistry from '../config/MoonbeamDIDRegistry.json'
import { MoonDidController } from '../controller'
import { MESSAGE_PREFIX, address } from '../helpers'
import { randomPrivatePublicKeys } from './testUtils'
import { ethers } from 'ethers'

import web3jsRaw from './web3Raw'

const ABI = MoonbeamDIDRegistry.abi

const _CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3' // Local Node
const _PROVIDER = 'http://127.0.0.1:8545/'
const ETHER_ACC = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' // Local Node
const privateKeyString = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const privateKey = Buffer.from(privateKeyString, 'hex')
const provider = new ethers.JsonRpcProvider(_PROVIDER)

const _CONTRACT = new ethers.Contract(_CONTRACT_ADDRESS, ABI, provider)

const gasLimit = 30000000

jest.setTimeout(100000)

describe('moonbeam-alpha contract', () => {
  it('should create a new DID', async () => {
    //Using the MoonDidController

    const {
      privKey: OriginalOwnerKey,
      address: OwnerAddress,
      pubKey: OriginalOwner,
    } = await randomPrivatePublicKeys(_PROVIDER)

    const identifier = `did:moon:alpha:${OwnerAddress}`

    const signer = new ethers.Wallet(privateKeyString, provider)

    const moonController = new MoonDidController(
      identifier,
      undefined,
      signer,
      undefined,
      undefined,
      undefined,
      _CONTRACT_ADDRESS,
      false
    )
    const hash = await moonController.createChangeOwnerHash(ETHER_ACC)
    const signature = OriginalOwnerKey.sign(hash)

    try {
      const res = await moonController.changeOwnerSigned(ETHER_ACC, {
        sigV: signature.v,
        sigR: signature.r,
        sigS: signature.s,
      })
    } catch (error) {
      console.log(error)
    }

    //Using the Web3Raw
    // const W3JSR = new web3jsRaw(_PROVIDER)
    // await W3JSR.getWeb3(ABI, _CONTRACT_ADDRESS)

    // const { privateKey: OriginalOwnerPrivateKey, address: OwnerAddress } = await W3JSR.createNewAccount()

    // const OriginalOwnerKey = new ethers.SigningKey(OriginalOwnerPrivateKey)

    // // let result = await W3JSR.ContractInstance.methods.identityOwner('0x35252b703078f9E9E96ffbC739372fE5eF6aebAF').call()
    // // console.log(result)

    // async function getPaddedNonceCompatibility(attribute = false): Promise<string> {
    //   let nonceKey
    //   if (true && attribute) {
    //     nonceKey = OwnerAddress
    //   } else {
    //     // @ts-ignore
    //     nonceKey = await W3JSR.ContractInstance.methods.identityOwner(getAddress(OwnerAddress)).call()
    //   }
    //   // @ts-ignore
    //   return zeroPadValue(toBeHex(await W3JSR.ContractInstance.methods.nonce(nonceKey).call()), 32)
    // }

    // async function createChangeOwnerHash(newOwner: address) {
    //   const paddedNonce = await getPaddedNonceCompatibility()

    //   const dataToHash = concat([
    //     MESSAGE_PREFIX,
    //     _CONTRACT_ADDRESS,
    //     paddedNonce,
    //     OwnerAddress,
    //     getBytes(concat([toUtf8Bytes('changeOwner'), newOwner])),
    //   ])

    //   return keccak256(dataToHash)
    // }

    // const hash = await createChangeOwnerHash(ETHER_ACC)

    // const signature = OriginalOwnerKey.sign(hash)

    // var functionName = 'changeOwnerSigned'
    // var params = [OwnerAddress, signature.v, signature.r, signature.s, ETHER_ACC]

    // try {
    //   const result = await W3JSR.prepareSignSend(
    //     ABI,
    //     _CONTRACT_ADDRESS,
    //     functionName,
    //     ETHER_ACC,
    //     privateKey,
    //     '0x00',
    //     params,
    //     gasLimit
    //   )
    //   console.log(result)
    // } catch (error) {
    //   console.log(error)
    // }
  })
})
