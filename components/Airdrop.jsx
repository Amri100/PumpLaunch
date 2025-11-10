import React, { useState } from 'react';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { parseUnits, formatUnits } from 'viem';

const AIRDROP_CONTRACT = '0x901014630558b49bf6404ff3c5e7f19d75fab368';
const INIT_TOKEN_CONTRACT = '0x6ed1637781269560b204c27Cd42d95e057C4BE44';

const AIRDROP_ABI = [
  {
    type: 'function',
    name: 'airdropERC20',
    inputs: [
      { name: '_tokenAddress', type: 'address' },
      {
        name: '_contents',
        type: 'tuple[]',
        components: [
          { name: 'recipient', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];

const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
];

function Airdrop() {
  const { address, isConnected } = useAccount();
  const [recipients, setRecipients] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropHash, setAirdropHash] = useState(null);
  const wagmiConfig = useConfig();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: INIT_TOKEN_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, AIRDROP_CONTRACT] : undefined,
    query: { enabled: !!address },
  });

  const { data: balance } = useReadContract({
    address: INIT_TOKEN_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const totalAmount = recipients.reduce((sum, recipient) => sum + recipient.amount, 0);
  const totalAmountWei = parseUnits(totalAmount.toString(), 18);
  const hasEnoughAllowance = allowance && allowance >= totalAmountWei;
  const hasEnoughBalance = balance && balance >= totalAmountWei;

  const addRecipient = () => {
    if (!newAddress || !newAmount || parseFloat(newAmount) <= 0) return;

    const recipient = {
      address: newAddress,
      amount: parseFloat(newAmount),
      id: Date.now(),
    };

    setRecipients([...recipients, recipient]);
    setNewAddress('');
    setNewAmount('');
  };

  const removeRecipient = (id) => {
    setRecipients(recipients.filter((recipient) => recipient.id !== id));
  };

  const processBulkInput = () => {
    if (!bulkInput.trim()) return;

    const lines = bulkInput.trim().split('\n');
    const newRecipients = [];

    lines.forEach((line, index) => {
      const parts = line.trim().split(',');
      if (parts.length >= 2) {
        const address = parts[0].trim();
        const amount = parseFloat(parts[1].trim());
        
        if (address && amount > 0) {
          newRecipients.push({
            address,
            amount,
            id: Date.now() + index,
          });
        }
      }
    });

    setRecipients([...recipients, ...newRecipients]);
    setBulkInput('');
  };

  const handleAirdrop = async () => {
    if (!address || recipients.length === 0) return;

    setIsAirdropping(true);
    try {
      if (!hasEnoughAllowance) {
        console.log('Approving tokens...');
        const approvalHash = await writeContract(wagmiConfig, {
          address: INIT_TOKEN_CONTRACT,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [AIRDROP_CONTRACT, totalAmountWei],
        });

        await waitForTransactionReceipt(wagmiConfig, { hash: approvalHash });
        refetchAllowance();
      }

      const contents = recipients.map((recipient) => ({
        recipient: recipient.address,
        amount: parseUnits(recipient.amount.toString(), 18),
      }));

      const hash = await writeContract(wagmiConfig, {
        address: AIRDROP_CONTRACT,
        abi: AIRDROP_ABI,
        functionName: 'airdropERC20',
        args: [INIT_TOKEN_CONTRACT, contents],
      });

      setAirdropHash(hash);
      await waitForTransactionReceipt(wagmiConfig, { hash });
      setRecipients([]);
    } catch (error) {
      console.error('Airdrop failed:', error);
    } finally {
      setIsAirdropping(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-6 animate-float">🪂</div>
        <h3 className="text-2xl font-bold mb-4 gradient-text">Token Airdrop</h3>
        <p className="text-gray-400">Connect your wallet to distribute tokens to your community</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Airdrop Manager</h2>
        <p className="text-xl text-gray-300">Distribute tokens to your community</p>
      </div>

      {/* Balance Info */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-purple-300 mb-6">Account Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-2">INIT Token Balance</h4>
            <p className="text-2xl font-bold text-white">
              {balance ? formatUnits(balance, 18) : '0'} INIT
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-2">Approved Amount</h4>
            <p className="text-2xl font-bold text-purple-300">
              {allowance ? formatUnits(allowance, 18) : '0'} INIT
            </p>
          </div>
        </div>
      </div>

      {/* Add Recipients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-purple-300 mb-6">Add Recipients</h3>
          
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Recipient Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="flex-1 bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={addRecipient}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-lg font-semibold text-purple-300 mb-4">Bulk Import</h4>
            <textarea
              placeholder="address1, amount1&#10;address2, amount2&#10;..."
              rows="4"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={processBulkInput}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Import CSV
            </button>
          </div>
        </div>

        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-purple-300 mb-6">
            Recipients ({recipients.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm text-white">
                    {recipient.address.slice(0, 8)}...{recipient.address.slice(-6)}
                  </p>
                  <p className="text-purple-300 font-semibold">
                    {recipient.amount} INIT
                  </p>
                </div>
                <button
                  onClick={() => removeRecipient(recipient.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          {recipients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No recipients added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Airdrop Summary */}
      {recipients.length > 0 && (
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-purple-300 mb-6">Airdrop Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800/30 rounded-xl p-4 text-center">
              <h4 className="text-sm text-gray-400 mb-2">Total Recipients</h4>
              <p className="text-2xl font-bold text-white">{recipients.length}</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 text-center">
              <h4 className="text-sm text-gray-400 mb-2">Total Amount</h4>
              <p className="text-2xl font-bold text-purple-300">{totalAmount.toFixed(2)} INIT</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 text-center">
              <h4 className="text-sm text-gray-400 mb-2">Status</h4>
              <p className={`text-lg font-bold ${hasEnoughBalance ? 'text-green-400' : 'text-red-400'}`}>
                {hasEnoughBalance ? 'Ready' : 'Insufficient Balance'}
              </p>
            </div>
          </div>

          <button
            onClick={handleAirdrop}
            disabled={isAirdropping || !hasEnoughBalance}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 animate-pulse-glow"
          >
            {isAirdropping ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Executing Airdrop...
              </div>
            ) : (
              '🪂 Execute Airdrop'
            )}
          </button>

          {airdropHash && (
            <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
              <p className="text-sm text-gray-400">
                Transaction Hash:
                <a
                  href={`https://etherscan.io/tx/${airdropHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline ml-1"
                >
                  {airdropHash.slice(0, 8)}...{airdropHash.slice(-6)}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.Airdrop = Airdrop;