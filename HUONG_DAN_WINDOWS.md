# Hướng dẫn các bước còn lại — Windows / VS Code

Bạn đã có toàn bộ source code. Làm lần lượt các bước sau, không cần tạo file Solidity/React từ đầu.
Tất cả lệnh bên dưới chạy trong Terminal của VS Code (PowerShell). `npm.cmd` là npm trên Windows, tránh bị chặn bởi chính sách chạy `npm.ps1`.

## 1. Giải nén, mở project và kiểm tra Node

1. Giải nén ZIP, ví dụ vào `G:\download\DH\smartcontract-react-ptit`.
2. Không chạy code ngay trong cửa sổ xem ZIP.
3. VS Code → File → Open Folder → chọn thư mục vừa giải nén.
4. Terminal → New Terminal.

```powershell
node -v
npm.cmd -v
```

Cần Node 22 hoặc 24 bản LTS phù hợp. Bộ code được kiểm tra trên Node 24; nếu máy đã có Node 24 thì không cần cài lại.
Nếu chưa có lệnh, cài Node LTS từ https://nodejs.org, đóng và mở lại VS Code.

## 2. Ví MetaMask và Sepolia ETH (PDF trang 1–7)

1. Cài MetaMask từ https://metamask.io hoặc dùng ví đã có.
2. Tạo ví thực hành nếu cần. Ghi lại cụm từ khôi phục riêng, không chụp vào báo cáo.
3. Chọn Ethereum Sepolia. Nếu chưa thấy, bật Show test networks trong danh sách/cài đặt mạng.
4. Sao chép địa chỉ ví bắt đầu bằng `0x`.
5. Vào https://cloud.google.com/application/web3/faucet/ethereum/sepolia.
6. Chọn Ethereum Sepolia, nhập địa chỉ ví, làm theo yêu cầu hiện tại của faucet.
7. Chờ token tới ví. Hạn mức faucet có thể khác con số 0.05 trong PDF.

Mỗi thành viên cần ít nhất 0.01 ETH để góp + gas. Người deploy cần thêm gas. Không góp hết số dư ví.
Mạng đúng có chain ID `11155111`; không dùng Ethereum Mainnet hoặc Base Sepolia.

## 3. Thực hành Remix (PDF trang 8–14)

1. Mở https://remix.ethereum.org.
2. Tạo `contracts/FirstSmartContract.sol`.
3. Copy nội dung từ `smartcontract/contracts/FirstSmartContract.sol` trong ZIP.
4. Solidity Compiler → chọn 0.8.20 → Compile FirstSmartContract.sol.
5. Deploy & Run → Browser Extension / Injected Provider – MetaMask (tùy giao diện).
6. Kết nối đúng tài khoản Sepolia; Contract = FirstSmartContract; Value = 0.
7. Deploy → xác nhận MetaMask → chờ thành công.
8. Mở Deployed Contracts → bấm `getBalance`: ban đầu 0.
9. Điền `500000000` vào `setBalance` → bấm → xác nhận giao dịch.
10. Chờ xong → bấm `getBalance`: phải ra 500000000.
11. Lưu ảnh và địa chỉ hợp đồng.

`balance` trong ví dụ là một biến số, không phải số ETH. Đọc `getBalance` không cần giao dịch; ghi `setBalance` cần gas.

## 4. Cài packages Hardhat và chạy thử không tốn gas

Trong terminal, đi đến đúng thư mục chứa package.json của Hardhat:

```powershell
cd G:\download\DH\smartcontract-react-ptit\smartcontract
npm.cmd ci
npm.cmd run compile
npm.cmd test
```

Nếu giải nén nơi khác, thay phần đường dẫn tương ứng.
`npm ci` dùng package-lock có sẵn để cài đúng bộ phiên bản đã kiểm tra. Lần đầu cần Internet và có thể mất vài phút.
Các dòng cảnh báo deprecated của bộ công cụ cũ trong tài liệu không đồng nghĩa cài đặt thất bại. Nếu lệnh dừng với `npm error`, đọc lỗi trước khi tiếp tục; không chạy `npm audit fix --force`.

Kết quả mong đợi: compile thành công và 8 tests passing. Các test dùng blockchain tạm trong bộ nhớ, không tiêu Sepolia ETH và không cần ví.

## 5. Điền RPC và private key trên máy bạn

Trong `smartcontract`:

```powershell
Copy-Item .env.example .env
```

Chỉ copy lần đầu; nếu `.env` đã có cấu hình thì mở sửa, không ghi đè.
Mở `.env`, điền:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/API_KEY_CUA_BAN
PRIVATE_KEY=PRIVATE_KEY_VI_THUC_HANH
```

RPC có thể dùng dịch vụ Ethereum Sepolia bạn đã đăng ký hoặc endpoint Sepolia tương thích khác. Đây chỉ là điểm truy cập mạng để deploy.
Với Alchemy: tạo/chọn app hỗ trợ Ethereum Sepolia và copy HTTPS RPC URL của đúng mạng từ dashboard.

Lấy key trong MetaMask: danh sách tài khoản → dấu ba chấm cạnh ví thực hành → Account details → Private key → xác nhận mật khẩu → copy vào `.env` trên máy bạn.
Không dán cụm từ khôi phục vào PRIVATE_KEY. Không gửi `.env` đã điền cho người khác. Frontend không dùng private key.

Kiểm tra:

```powershell
npm.cmd run check:sepolia
```

Phải hiện Sepolia, địa chỉ ví và số dư > 0. Lệnh này chỉ đọc, không gửi giao dịch.
Nếu báo Network sepolia doesn't exist: chưa điền RPC thật hoặc đặt `.env` sai thư mục.

## 6. Deploy hợp đồng mẫu bằng Hardhat (PDF trang 14–18)

```powershell
npm.cmd run deploy:first
```

Lệnh tương đương:

```powershell
npx.cmd hardhat run scripts/sample-script.js --network sepolia
```

Hardhat ký bằng key trong `.env`, không cần popup MetaMask. Chờ terminal in địa chỉ contract và hash giao dịch.
Mở địa chỉ trên https://sepolia.etherscan.io để kiểm tra giao dịch tạo contract thành công.
Muốn thử đọc/ghi: vào Remix, compile FirstSmartContract như bước 3, kết nối MetaMask, nhập địa chỉ mới vào At Address, rồi thử setBalance/getBalance.
Hợp đồng Remix và hợp đồng Hardhat là hai bản riêng nếu deploy hai lần.

## 7. Deploy DominionDAO — một người làm cho cả nhóm (PDF trang 19)

Mã đã có sẵn và đã sửa điều kiện bắt buộc chờ 5 phút. Không cần copy lại repository.

```powershell
npm.cmd run deploy:sepolia
```

Chờ terminal in:

```text
Deployment tx: 0x...
DominionDAO: 0x...
ABI and web3-app/.env.local updated.
```

Script tự:
- Ghi ABI vào `web3-app/src/abis/DominionDAO.json`.
- Ghi địa chỉ vào `web3-app/.env.local` (chỉ địa chỉ công khai).
- Lưu biên nhận triển khai trong `smartcontract/deployments/`.

Nếu `.env.local` cũ tồn tại, script tạo bản backup trước khi ghi. Không chạy lại deploy chỉ để mở web: mỗi lần deploy tạo một quỹ mới.

Gửi cho nhóm: **địa chỉ DominionDAO trên Sepolia và cùng bản ABI/code frontend**. Không gửi `.env` của Hardhat.
Địa chỉ FirstSmartContract không dùng cho web DAO.

## 8. Cài và chạy React (PDF trang 20–56)

Mở terminal mới hoặc chuyển thư mục:

```powershell
cd G:\download\DH\smartcontract-react-ptit\web3-app
npm.cmd ci
npm.cmd run build
npm.cmd start
```

Không chạy lại create-react-app. Không thay package.json bằng bản PDF vì bản trong ZIP đã được đồng bộ và khóa phiên bản.
Mở URL terminal hiển thị, thường là http://localhost:3000.
Nếu port 3000 bận, đồng ý dùng port khác và mở đúng URL mới.
Giữ terminal đang chạy khi dùng web. Dừng bằng Ctrl+C.

**Thành viên không deploy:** tạo `.env.local` từ `.env.example`, điền địa chỉ chung:

```powershell
Copy-Item .env.example .env.local
```

```env
REACT_APP_CONTRACT_ADDRESS=0xDIA_CHI_DAO_CHUNG_CUA_NHOM
```

Sau khi sửa `.env.local`, dừng và khởi động lại web. `.env.local` ưu tiên hơn `.env`; nên chỉ dùng một nơi cấu hình địa chỉ.
Mỗi người chạy web trên máy mình, dữ liệu vẫn chung do cùng contract trên Sepolia.

## 9. Kết nối ví (PDF trang 57)

1. Bấm Kết nối / chuyển Sepolia.
2. MetaMask hỏi chuyển mạng nếu cần → chấp nhận.
3. Chọn tài khoản cần dùng → Connect.
4. Kiểm tra địa chỉ rút gọn trên header.
5. Kiểm tra địa chỉ hợp đồng ở cuối trang giống địa chỉ nhóm đã thống nhất.
6. Lần đầu quỹ mới có số dư 0, chưa có đề xuất.

Chưa có địa chỉ contract hoặc chưa kết nối ví: web hiển thị hướng dẫn, không bịa dữ liệu.
Đổi tài khoản/đổi mạng làm web tải lại để tránh dùng trạng thái ví cũ.

## 10. Góp ETH thành stakeholder (mỗi người trong nhóm 3–5 người)

1. Nhập `0.01` trong ô góp tiền (ETH, không phải wei).
2. Bấm Đóng góp → kiểm tra MetaMask → Confirm.
3. Chờ thông báo thành công có link giao dịch.
4. “Bạn đã đóng góp” đạt 0.01 ETH, hiển thị stakeholder và nút Tạo đề xuất.

Nếu 3 người góp 0.01 ETH mỗi người, số dư quỹ là 0.03 ETH. Gas được trừ riêng ở ví.
Phải góp qua chức năng này; không dùng MetaMask Send trực tiếp tới địa chỉ contract, vì thao tác đó không gọi contribute().

## 11. Tạo đề xuất trả tiền cho A

Một stakeholder bấm Tạo đề xuất:

| Trường | Ví dụ |
|---|---|
| Tiêu đề | Chi kinh phí thực hành cho A |
| Mô tả | Chuyển 0.005 Sepolia ETH cho A theo biểu quyết nhóm |
| Beneficiary | Địa chỉ ví thật của A |
| Amount | 0.005 |

Kiểm tra địa chỉ A rồi bấm Tạo đề xuất qua MetaMask → xác nhận.
Thời hạn = block tạo đề xuất + 300 giây. Không tính từ phiếu cuối cùng.
Quỹ chưa giữ riêng tiền cho từng đề xuất; nếu có nhiều đề xuất, lúc payout vẫn cần đủ tiền.

## 12. Vote trước hạn

1. Mỗi người mở Xem đề xuất & thao tác.
2. Đọc đề xuất, người nhận và số tiền.
3. Bấm Đồng ý / Accept hoặc Từ chối / Reject → xác nhận MetaMask.
4. Chờ phiếu ghi nhận; xem danh sách voters.

Mỗi ví stakeholder chỉ vote một lần trên một đề xuất. Ví có quyền không được đổi phiếu.
Để hoàn tất ví dụ thành công, có thể cùng chọn Accept (hoặc bố trí số Accept lớn hơn Reject).
Quy tắc mẫu là upvotes > downvotes, không có quorum theo tổng thành viên.
Web cập nhật mỗi 10 giây; xác nhận on-chain mới là kết quả cuối cùng.

## 13. Chờ 5 phút và thanh toán

1. Chờ blockchain vượt qua deadline. Trạng thái chuyển Passed nếu Accept > Reject.
2. Một stakeholder (nên khác A để dễ so số dư) mở chi tiết đề xuất.
3. Bấm Thanh toán / Payout → xác nhận MetaMask.
4. Chờ thành công; đề xuất chuyển Paid.

Ví dụ: quỹ 0.03 ETH, payout 0.005 ETH → quỹ còn 0.025 ETH.
Ví người bấm Payout trả gas. Người nhận A nhận đúng khoản ETH đề xuất.
Nếu RPC chưa báo block sau deadline, chờ cập nhật tiếp theo. Smart contract không cho payout sớm.

## 14. Xác minh A nhận tiền và lưu bài

1. Trước payout, chụp số dư ví A (sau khi A đã góp/vote).
2. Trong khoảng đối chiếu, A không gửi giao dịch khác.
3. Sau payout, mở MetaMask và explorer của địa chỉ A.
4. Kiểm tra chuyển ETH nội bộ từ DAO tới A; giao dịch thành công.
5. Nếu A không trả gas trong giao dịch này, số dư tăng đúng 0.005 ETH.
6. Kiểm tra quỹ giảm tương ứng và proposal Paid.

Lưu minh chứng:
- Remix setBalance/getBalance.
- Hardhat compile/deploy hợp đồng mẫu.
- Deploy DAO: địa chỉ, hash, trạng thái success.
- Địa chỉ 3–5 thành viên và hợp đồng chung.
- Góp tiền, quyền stakeholder.
- Đề xuất (người nhận, số tiền, deadline).
- Danh sách phiếu.
- Payout, số dư A trước/sau và số dư quỹ.

Không chụp private key hoặc cụm từ khôi phục. ZIP nộp source nên bỏ `node_modules`, `build`, `.env`, `.env.local` và các backup cấu hình cá nhân; giữ `.env.example`.

## 15. Các lỗi dễ gặp

| Lỗi | Cách kiểm tra |
|---|---|
| ENOENT package.json | Chạy trong smartcontract hoặc web3-app, không phải thư mục cha |
| Network sepolia doesn't exist | Điền RPC thật vào smartcontract/.env |
| Invalid account / private key | Key hex của tài khoản, không phải địa chỉ ví hay 12 từ |
| Insufficient funds | Ví thiếu ETH cho gas + giá trị giao dịch |
| Web báo chưa cấu hình | Kiểm tra web3-app/.env.local và khởi động lại npm start |
| Không có contract tại địa chỉ | Sai mạng hoặc lấy nhầm địa chỉ FirstSmartContract |
| Stakeholders only | Đúng ví chưa góp đủ 0.01 ETH vào đúng quỹ |
| Double voting not allowed | Ví đã vote đề xuất này |
| Proposal duration expired | Đã hết 5 phút để vote |
| Voting is still open | Chưa đến deadline theo block |
| Insufficient votes | Accept không lớn hơn Reject |
| Insufficient fund | Quỹ DAO thiếu tiền payout |
| Payment sent before | Đã payout rồi |
| Yêu cầu ví đang chờ | Mở popup MetaMask đang chờ xử lý, không bấm liên tục |

Sau khi mở lại máy: nếu đã deploy và cài gói, chỉ cần vào web3-app, chạy npm.cmd start rồi kết nối MetaMask. Dữ liệu hợp đồng vẫn nằm trên Sepolia.
