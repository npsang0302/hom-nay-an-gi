# Hôm Nay Ăn Gì? 🍲

Website gợi ý thực đơn mang phong vị miền Bắc, chạy hoàn toàn tĩnh trên trình duyệt.

## Tính năng

- **339 món và thành phần bữa ăn**: thịt, gia cầm, cá/hải sản, trứng/đậu, rau, canh, lẩu, nướng, khai vị, tinh bột, món ăn kèm và đồ nhúng.
- **4 chế độ chính**: Cơm bình dân, Bữa cải thiện (mâm cơm/lẩu/nướng/đặc sản), Bữa ăn nhậu, Bữa ăn nhanh.
- **Ghép thực đơn theo cấu trúc**: không random một danh sách tên món vô điều kiện; lọc và chấm điểm độ đa dạng, cách chế biến, nhóm thực phẩm.
- **Khóa món / đổi món**: khóa món muốn giữ, random các món khác hoặc chỉ đổi một món.
- **Bộ lọc**: số người, thời gian, quy mô, ăn chay, tránh một số nguyên liệu.
- **Lưu tại trình duyệt**: yêu thích, lịch sử 30 bữa, thiết lập, giao diện sáng/tối.
- **Danh sách đi chợ**: tổng hợp nguyên liệu, gộp trùng, đánh dấu đã mua và copy.
- **Khám phá**: tìm kiếm món theo tên hoặc nguyên liệu, lọc theo danh mục.
- Không có ngân sách hoặc giá tiền. Không cần đăng nhập, API hay backend.

## Chạy

Mở thư mục bằng một HTTP static server bất kỳ, chẳng hạn:

```bash
python3 -m http.server 8080
```

Truy cập `http://localhost:8080`. Không nên mở trực tiếp `index.html` bằng `file://`, vì trình duyệt thường chặn JavaScript ES modules trong ngữ cảnh đó.

Để đưa lên GitHub Pages, đặt toàn bộ file và thư mục trong repository và dùng `index.html` tại root. Tất cả đường dẫn trong project là đường dẫn tương đối; không cần build.

## Bố cục source

| File | Mục đích |
|---|---|
| `index.html` | Cấu trúc giao diện, metadata, dialog |
| `css/style.css` | UI/UX, responsive, dark mode |
| `js/data.js` | Dữ liệu và chuẩn hóa metadata cho 339 mục |
| `js/generator.js` | Bộ lọc, ghép món, chấm điểm, đổi món, khóa món |
| `js/nutrition.js` | Đánh giá định tính nhóm thực phẩm |
| `js/storage.js` | LocalStorage, serialize/revive dữ liệu |
| `js/app.js` | UI state, event handlers, render, dialogs |
| `tests/test.mjs` | Unit/integration tests chạy bằng Node.js (chỉ dành cho phát triển) |

## Thêm hoặc sửa món

Mở `js/data.js`, tìm `sections`. Mỗi nhóm có `group`, `role`, `emoji` và `rows`. Mỗi dòng được viết theo định dạng:

```text
Tên món|nguyên liệu 1,nguyên liệu 2,nguyên liệu 3|phương pháp|phút|thẻ1,thẻ2
```

Ví dụ:

```text
Rau cải luộc gừng|rau cải,gừng,muối|luộc|15|quick
```

Hệ thống tự sinh ID, phân nhóm nguyên liệu, đánh dấu nhóm thực phẩm và xác định chế độ phù hợp. Khi chỉnh sửa dữ liệu, nên kiểm tra kỹ thành phần để bộ lọc dị ứng/ăn chay có ý nghĩa; việc nhận diện bằng từ khóa **không thay thế xác minh an toàn dị ứng thực phẩm**.

Muốn thay quy tắc số món mỗi chế độ, sửa `getSlots` trong `js/generator.js`. Muốn thêm chế độ chính, bổ sung định nghĩa trong `MEAL_MODES`, template và giao diện tùy chọn.

## Kiểm thử

Không cần dependency. Với Node.js 24 trở lên:

```bash
node --test tests/test.mjs
```

Các test bao gồm: 250+ mục hợp lệ, không trùng ID, random 1.000 lần, cân đối vai trò, loại trừ nguyên liệu, ăn chay, khóa món 100 lần, đổi một món, thời gian và khôi phục dữ liệu.

## Giới hạn cần hiểu đúng

- **Dữ liệu tĩnh:** Món và nguyên liệu do project khai báo. Thời gian chuẩn bị là ước tính, không phải số đo thực tế.
- **Dinh dưỡng:** Hệ thống đánh giá định tính các nhóm thực phẩm; không tính năng lượng, khẩu phần gram, vitamin hay mức đáp ứng dinh dưỡng cá nhân.
- **Dị ứng:** Bộ lọc hoạt động trên nguyên liệu được liệt kê, không thể xác nhận nhiễm chéo, nguyên liệu ẩn hoặc cách chế biến tại nhà hàng.
- **Đi chợ:** Không bịa định lượng gram khi chưa có công thức đã kiểm chứng.
- **Ẩm thực:** Bao gồm nhiều món truyền thống miền Bắc và các món phổ biến tại gia đình miền Bắc; không khẳng định tất cả là món có nguồn gốc miền Bắc.
- **Lưu trữ:** LocalStorage chỉ tồn tại trong trình duyệt/thiết bị đó, có thể mất khi xóa dữ liệu web.

Đây là project tĩnh, không phụ thuộc các dịch vụ bên ngoài để sử dụng các chức năng chính. Font Google là phần làm đẹp tùy chọn và có fallback.
