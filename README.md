# SuperHelper Front-End

## Description

This repository contains the user interface for the **SuperHelper** project, a decentralized application enabling users to create, accept, complete, and rate paid jobs leveraging by the Ethereum blockchain.

The front-end uses:

- **Next.js v14**
- **TypeScript**
- **React**
- **Wagmi & Viem (for blockchain integration)**

This interface enables interaction with the `SuperHelper` smart contract.

---

## Quick Start

### 1. Clone the repository

```bash
git clone <frontend_repository_url>
cd <your_frontend_folder_name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local` file

Create a `.env.local` file at the root of the project and fill in the following variables:

```env
NEXT_PUBLIC_PROJECT_ID=<your_project_id>
NEXT_PUBLIC_ENABLE_TESTNETS=<boolean_to_work_on_testnet_or_local>
NEXT_PUBLIC_SUPERHELPER_ADDRESS=<address_of_smart_contract_superhelper>
NEXT_PUBLIC_DEPLOYMENT_BLOCK=<deployment_block_of_smart_contract>
NEXT_PUBLIC_RPC_URL_SEPOLIA=<your_rpc_url_for_sepolia>
```

---

## Run in development mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the live application.

---

## Smart Contract Interactions

The frontend communicates with the `SuperHelper` smart contract, which supports the following operations:

- **Registration** of new users.
- **Creation, assignment, and full management** of token-paid jobs (HELP).
- Task status follow-up (**created, assigned, completed, canceled, disputed**).
- Rewarding users with badges (BRONZE, SILVER, GOLD).

### Events available via smart contract:

| Event                    | Description                                                      |
|--------------------------|------------------------------------------------------------------|
| `FirstRegistration`      | Issued during the very first registration of a user              |
| `JobAdded`               | When a new job is created                                        |
| `JobTaken`               | When a job is taken by a user                                    |
| `JobCompletedAndPaid`    | Job successfully completed and payment issued                    |
| `JobCompletedButNotPaid` | Job completed but payment not issued due to dispute not resolved |
| `JobCanceled`            | When the creator cancels its job                                 |
| `JobDisputed`            | When the creator marks the job as disputed                       |

---

## License

This project is licensed under the MIT License.