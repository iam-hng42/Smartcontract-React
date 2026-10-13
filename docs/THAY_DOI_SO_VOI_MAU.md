# Những thay đổi so với PDF / repository bài tập

Nguồn: `Smartcontract&React_PTIT.pdf`, 61 trang; mã Solidity lấy từ
https://github.com/VuManh-07/CodeSmartcontractThucHanhPtit/blob/main/contracts/DominionDAO.sol

Bản gốc được giữ ở `DominionDAO.original.sol.txt` để đối chiếu. Bộ này là bản thực hành có sửa lỗi, không phải bản sao nguyên xi.

## Giữ nguyên mục tiêu và quy tắc

- FirstSmartContract có setBalance/getBalance.
- DominionDAO: contribute, createProposal, performVote, payBeneficiary, các hàm đọc số dư/quyền/phiếu.
- 0.01 ETH để thành stakeholder; đóng góp cộng dồn.
- Vote kéo dài 5 phút từ thời gian block tạo proposal; mỗi stakeholder có một phiếu.
- Accept > Reject để thông qua; không thêm quorum theo tổng thành viên.
- Stakeholder thực hiện payout; đủ quỹ và chỉ trả một lần.
- Ethereum Sepolia, frontend React, ví MetaMask, nhóm 3–5 người dùng chung địa chỉ contract.
- Giữ tên trường `choosen` từ mẫu để ABI và frontend tương thích.

## Sửa ở smart contract

1. `payBeneficiary` kiểm tra đã hết deadline. Mẫu thiếu kiểm tra này ở tầng hợp đồng.
2. Kiểm tra proposal tồn tại trước đọc/vote/payout.
3. Kiểm tra title/description có nội dung, beneficiary khác địa chỉ 0, amount > 0 và không vượt quỹ tại lúc tạo.
4. Chặn vote trùng bằng mapping thay vì quét toàn bộ lịch sử người vote; lịch sử vẫn được giữ cho hàm đọc.
5. Khi payout, cập nhật trạng thái và số dư trước external call, tiếp tục giữ ReentrancyGuard. Nếu chuyển ETH thất bại, giao dịch revert toàn bộ.
6. `getProposal`/`getProposals` trả `passed` tính theo thời gian block + số phiếu. Sửa vấn đề mẫu gán passed trước revert nên không lưu lại được.
7. Mở getter cho ngưỡng stakeholder, thời hạn vote, totalProposals; thêm hasVoted.
8. Rút gọn contribute nhưng giữ quyền contributor/stakeholder và số dư đóng góp cộng dồn.

Tiền không được giữ riêng cho từng đề xuất. Hai đề xuất cùng thông qua vẫn có thể tranh cùng số dư; contract kiểm tra lại quỹ khi payout. Số dư đóng góp cá nhân là lịch sử góp, không phải phần tiền có thể rút; bài không có hàm rút vốn.

## Sửa ở Hardhat

- Dùng Hardhat 2 + ethers 5 + OpenZeppelin 4.9.6 để giữ API và đường import của tài liệu.
- Dùng plugin ethers trực tiếp; không thêm bộ Waffle không cần cho deploy. Kiểm thử dùng Chai 4.
- Cấu hình RPC URL và accounts đúng trong networks.sepolia; private key ở `.env`.
- Compiler solc 0.8.20 cài qua npm; không phải tải compiler lần hai. EVM target paris tương thích code bài tập.
- Không cần menu tạo project; toàn bộ file cấu hình đã có trong ZIP.
- Script deploy tự xuất ABI và cấu hình địa chỉ công khai sang web.

## Sửa ở frontend

- Giữ React 17, CRA/react-app-rewired, Web3 1.x và Tailwind 3. Không chuyển sang Hardhat 3, ethers 6 hoặc Web3 4.
- Bỏ dependencies không dùng: chat, HD wallet provider frontend, các Babel preset cũ; giao diện vẽ thanh phiếu bằng CSS nên không cần Recharts.
- Giao diện tiếng Việt, responsive; các nút vẫn ghi Accept/Reject/Payout để đối chiếu PDF.
- Các chức năng chính, tên thư mục components/views/store/abis và tên hàm service được giữ gần mẫu.
- Payout đặt trong trang chi tiết đề xuất để nhìn rõ người nhận/số tiền trước khi ký, thay vì nút ngay bảng trang chủ.
- Chưa cấu hình/chưa cài ví/chưa kết nối/sai mạng đều có thông báo riêng; không gọi contract rỗng.
- Chỉ đọc từ MetaMask trên Sepolia; không có private key trong web.
- Effect không dùng async callback trực tiếp; listener ví được dọn dẹp đúng.
- Các tác vụ ghi phải chờ receipt thành công; hủy ký hoặc revert không báo success.
- Refresh sau giao dịch và polling 10 giây; số dư/proposal cùng đọc ở một block.
- Trạng thái dùng thời gian block từ RPC; không dựa vào đồng hồ máy để cho phép payout sớm.
- Danh sách lọc giữ nguyên lựa chọn khi cập nhật; phiếu/chi tiết cũng cập nhật theo block.
- Không có dữ liệu giả mặc định. Chưa kết nối hiển thị dấu gạch và hướng dẫn.
- Không có nút Load More giả (mẫu có nút không gắn xử lý); hiển thị các phiếu của nhóm thực hành nhỏ.
- Không tự reload sau mỗi giao dịch nên link receipt và thông báo thành công được giữ để chụp minh chứng.

## Giới hạn

Đây là project giảng dạy, không phải một DAO sản xuất đã được kiểm toán. Nó tải toàn bộ proposals/phiếu của đề xuất, phù hợp nhóm thực hành nhỏ. Bộ công cụ CRA/Web3 1 được giữ để sát tài liệu nên npm có thể báo dependency deprecated.
Không tự deploy hoặc xác nhận giao dịch Sepolia thay người học. Người học phải dùng ví, ETH faucet và contract thật của nhóm để hoàn tất minh chứng.
