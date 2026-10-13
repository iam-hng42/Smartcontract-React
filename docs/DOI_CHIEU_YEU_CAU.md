# Đối chiếu đầy đủ bài thực hành

| Yêu cầu PDF | File/chức năng trong ZIP | Người học còn làm |
|---|---|---|
| Cài MetaMask, tạo/đăng nhập ví (tr.1–6) | Hướng dẫn Windows bước 2 | Thao tác trên ví riêng |
| Chọn Sepolia, faucet (tr.6–7) | Web kiểm tra chain ID 11155111 | Nhận test ETH |
| Remix FirstSmartContract (tr.8–14) | contracts/FirstSmartContract.sol | Copy vào Remix, compile, deploy, set/get |
| Khởi tạo Hardhat (tr.14–15) | Project smartcontract có sẵn | npm ci |
| Compile/deploy hợp đồng mẫu (tr.16–18) | scripts/sample-script.js | npm run compile; npm run deploy:first |
| Deploy DominionDAO (tr.19) | contracts/DominionDAO.sol; scripts/deploy-dao.js | Một người deploy lên Sepolia |
| Khởi tạo React (tr.20) | Project web3-app có sẵn | npm ci; không cần tạo project lần nữa |
| Packages/config (tr.21–24) | package.json, lockfile, config-overrides.js, tailwind.config.js, postcss.config.js | Không phải tự chép lại |
| Địa chỉ contract trong env (tr.24) | .env.example; script tự ghi .env.local | Thành viên khác điền địa chỉ chung |
| ABI (tr.24) | src/abis/DominionDAO.json | Đã có; tự cập nhật khi deploy |
| Store (tr.25–26) | src/store/index.jsx | Đã viết |
| Kết nối và giao dịch Web3 (tr.26–31) | src/Blockchain.services.jsx | Kết nối ví và ký giao dịch |
| Banner/Contribute (tr.31–34) | components/Banner.jsx | Góp >=0.01 ETH |
| CreateProposal (tr.34–37) | components/CreateProposal.jsx | Điền thông tin và địa chỉ A |
| Header/wallet (tr.37–40) | components/Header.jsx | Kết nối đúng ví |
| Chi tiết/vote/biểu đồ (tr.40–43) | components/ProposalDetails.jsx | Accept/Reject |
| Danh sách/filter (tr.43–48) | components/Proposals.jsx | All/Open/Closed, trạng thái |
| Voters (tr.48–53) | components/Voters.jsx | Xem phiếu từng địa chỉ |
| Home/Proposal (tr.53–54) | views/Home.jsx, views/Proposal.jsx | Đã viết |
| App, CSS, entry (tr.54–56) | App.jsx, index.css, index.jsx | npm start |
| Kết nối ví (tr.57) | MetaMask, chuyển/kiểm tra Sepolia | Xác nhận trong MetaMask |
| Góp tiền (tr.57) | contribute() | Mỗi người góp từ 0.01 ETH và giữ gas |
| Tạo/xem đề xuất (tr.57–58) | createProposal/getProposals | Thực hiện đề xuất chung |
| Bỏ phiếu (tr.59) | performVote/getVotesOf | 3–5 người vote trước hạn |
| Payout (tr.59) | payBeneficiary, nút ở chi tiết | Chờ hết 5 phút, một stakeholder ký |
| Nhóm dùng chung address (tr.61) | Cấu hình public contract address | Chia sẻ address + ABI, không chia sẻ key |
| Kiểm tra A nhận tiền (tr.61) | Link explorer, số dư quỹ, trạng thái Paid | Đối chiếu số dư A + internal transfer |

Dòng mở đầu PDF nhắc ERC20 USDT nhưng bài tập cụ thể dùng quỹ ETH DominionDAO. Bộ này không tự thêm token ngoài yêu cầu thao tác.
