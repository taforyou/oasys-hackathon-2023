export const signAPI = async ({ method, domain, provider, chainId, address }) => {
  const deadline = Math.floor(Date.now() / 1000) + 300
  const data = {
    primaryType: 'Request',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
      ],
      Request: [
        { name: 'method', type: 'string' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    domain: {
      name: domain,
      version: '1',
      chainId,
    },
    message: {
      method,
      deadline,
    }
  }

  const signature = await provider.send("eth_signTypedData_v4", [address.toLowerCase(), JSON.stringify(data)])
  return {
    signature: signature?.result || signature,
    deadline
  }
}