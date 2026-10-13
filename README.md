# PTIT DominionDAO — Bộ code bài thực hành Smart contract & React

**Bắt đầu bằng file `HUONG_DAN_WINDOWS.md`.**

Đây là project độc lập cho tài liệu `Smartcontract&React_PTIT.pdf` (61 trang).
Code đã có sẵn; không cần tạo lại file theo hướng dẫn cũ và không cần chạy Create React App.

## Có trong ZIP

- `smartcontract/contracts/FirstSmartContract.sol`: ví dụ Remix/Hardhat trong Bài 1.
- `smartcontract/contracts/DominionDAO.sol`: quỹ góp ETH, đề xuất, vote, payout.
- `smartcontract/scripts/`: kiểm tra Sepolia, deploy và tự xuất ABI/địa chỉ sang web.
- `smartcontract/test/`: kiểm thử chức năng và các điều kiện từ chối giao dịch.
- `web3-app/`: React 17 + Web3 1 + Tailwind 3, tương thích cách tiếp cận trong PDF.
- `HUONG_DAN_WINDOWS.md`: thao tác còn lại trên VS Code/Windows, từ cài gói tới kiểm tra A nhận tiền.
- `docs/THAY_DOI_SO_VOI_MAU.md`: các lỗi đã sửa và khác biệt so với code mẫu.
- `docs/DOI_CHIEU_YEU_CAU.md`: đối chiếu yêu cầu PDF với file/chức năng.
- `docs/KIEM_THU.md`: kết quả kiểm tra và giới hạn xác minh.
- `docs/DominionDAO.original.sol.txt`: bản mã gốc tải từ repository bài tập để đối chiếu.

## Các việc bạn vẫn cần làm

1. Cài/mở MetaMask, chọn Sepolia và nhận ETH thử nghiệm.
2. Chạy `npm.cmd ci` trong từng project (đã có package-lock.json).
3. Điền RPC URL + private key ví thực hành vào `smartcontract/.env` trên máy bạn.
4. Làm phần Remix, deploy hợp đồng mẫu và deploy DAO theo hướng dẫn.
5. Chạy web; nhóm 3–5 người dùng cùng địa chỉ DAO, mỗi người dùng ví riêng.
6. Góp từ 0.01 ETH, tạo đề xuất, vote, chờ 5 phút và payout cho A; lưu minh chứng.

Mỗi lần chạy script deploy là một hợp đồng mới và tốn gas. Nếu đã có địa chỉ DAO chung, thành viên khác chỉ cần cấu hình web, không deploy lại.

## Thông số

| Nội dung | Giá trị |
|---|---|
| Mạng web/triển khai | Ethereum Sepolia, chain ID 11155111 |
| Quyền stakeholder | Tổng góp >= 0.01 ETH |
| Thời hạn vote | 300 giây tính từ block tạo đề xuất |
| Điều kiện thông qua | Upvotes > downvotes sau thời hạn |
| Payout | Stakeholder gọi, đủ quỹ, chưa trả trước đó |
| Cập nhật web | Polling mỗi 10 giây, trạng thái lấy theo thời gian block |

ETH trong bài là Sepolia ETH thử nghiệm. Không cần mua ETH mainnet.
Không có private key, API key thật hoặc địa chỉ hợp đồng giả trong ZIP.
Giao diện không hiển thị dữ liệu mẫu như dữ liệu thật; cần cấu hình và kết nối ví để tải dữ liệu.

Nguồn bài tập: https://github.com/VuManh-07/CodeSmartcontractThucHanhPtit

Phần Hardhat dùng plugin ethers 5 thay Waffle; phần React bỏ các dependency không phục vụ DAO (chat, HD wallet trong frontend). Những khác biệt này được ghi đầy đủ trong `docs/THAY_DOI_SO_VOI_MAU.md`.
