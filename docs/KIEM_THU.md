# Kết quả kiểm tra bộ code

## Hợp đồng

Đã chạy trên môi trường phát triển Linux với Node.js 24:

```text
npm run compile
Compiled 11 Solidity files successfully (evm target: paris).

npm test
8 passing

npm run export:abi
ABI exported to web3-app/src/abis/DominionDAO.json
```

Các ca kiểm thử trong `smartcontract/test/DominionDAO.test.js`:

1. FirstSmartContract đọc 0, ghi và đọc lại 500000000.
2. Góp cộng dồn 0.004 + 0.006 ETH cấp stakeholder; chặn góp 0.
3. Người ngoài không được tạo đề xuất, vote, payout.
4. Dữ liệu đề xuất không hợp lệ và proposal không tồn tại bị từ chối.
5. Deadline đúng 300 giây; chặn vote trùng và vote quá hạn.
6. Chặn payout sớm; sau deadline chuyển đúng 0.005 ETH, quỹ còn 0.025, chặn trả lần hai.
7. Hòa phiếu/không có phiếu không được payout.
8. Kiểm tra lại số dư nếu đề xuất khác đã tiêu quỹ trước.

Kiểm thử tự động có tăng thời gian của blockchain tạm để không chờ 5 phút thật. Không có chức năng tăng thời gian trên Sepolia.

## Web

Đã chạy `npm run build`: **Compiled successfully**.
Không điền địa chỉ hợp đồng thử nghiệm hoặc key thử nghiệm vào source giao cho người học.

## Giới hạn xác minh

- Không deploy lên Sepolia thay người học, không ký bằng ví thật của người học.
- Người học cần kiểm tra RPC, faucet, xác nhận ví, các giao dịch nhóm và số dư người nhận trên Sepolia.
- Lệnh Windows được viết theo PowerShell nhưng kiểm tra build/contract thực hiện trên Linux. Cần cài gói bằng `npm.cmd ci` trên Windows để lấy dependency phù hợp máy.
- Kết quả kiểm thử nội bộ không thay thế ảnh minh chứng bài thực hành trên Sepolia của nhóm.

## Kiểm tra giao diện bằng trình duyệt tự động

Đã thực hiện trên Chromium headless với 3 tài khoản của mạng Hardhat biệt lập và ví trình duyệt mô phỏng EIP-1193. Chain ID thử nghiệm được cấu hình giống Sepolia để kiểm tra luồng web; đây **không phải mạng Sepolia công khai** và **không phải kiểm thử extension MetaMask thật**.

- Hủy giao dịch trong ví mô phỏng: có thông báo lỗi, không báo thành công, quỹ không thay đổi.
- Ba cửa sổ trình duyệt độc lập góp 0.01 ETH mỗi ví; tổng quỹ 0.03 ETH và cấp stakeholder.
- Tạo đề xuất qua form UI; người nhận và số tiền 0.005 ETH được ghi đúng.
- Cả ba ví Accept qua UI; phiếu và danh sách voters cập nhật, nút vote lại được ẩn.
- Sau khi tăng thời gian mạng thử 301 giây, Payout qua UI chuyển đúng 0.005 ETH cho người nhận, quỹ còn 0.025 ETH và trạng thái Paid.
- Viewport 390px không tràn ngang; kiểm tra ảnh giao diện desktop/mobile.
- Trường hợp không có ví hiển thị hướng dẫn cài MetaMask.
- Không ghi nhận lỗi JavaScript pageerror trong lượt kiểm tra này.
