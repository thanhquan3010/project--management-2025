# Hướng Dẫn Khám Phá Mã Nguồn ProjectHub

---

## 1. Khởi Động Bức Tranh Tổng Quan
- **Đọc `README.md`** để nắm mô tả tính năng, công nghệ sử dụng và các lệnh khởi chạy nhanh.
- **Mở `package.json`** xem danh sách script, phụ thuộc, công cụ lint/test.
- **Khám phá `src/store/index.js`** để biết các slice chính điều khiển state toàn cục.

> ✅ Kết quả: bạn biết dự án gồm những miền chính nào, đang dùng công cụ gì.

---

## 2. Hiểu Lớp Backend Giả Lập
### File: `src/services/api/mockApi.js`
1. **Xem cấu trúc DB trong bộ nhớ** (đầu file) để biết dữ liệu mẫu cho workspace/project/task/user.
2. **Đọc `ROLES`** để rõ ma trận phân quyền và khả năng từng vai trò.
3. **Theo dõi các helper** (`sanitizeUser`, `ensureProjectCounts`, `makeId`) nhằm nắm cách chuẩn hóa dữ liệu.
4. **Đi qua từng nhóm API**:
   - `auth`: đăng nhập/đăng xuất, profile, CRUD người dùng.
   - `workspaces`, `projects`, `tasks`: các thao tác CRUD và hiệu ứng dây chuyền (xóa project sẽ xóa task liên quan).
   - `roles`: endpoint phục vụ UI khi chọn vai trò.
5. **Chú ý cấu trúc trả về** – tất cả được chuyển sang Plain Object để đưa vào Redux.

> ✅ Kết quả: bạn hiểu dữ liệu “backend” có dạng ra sao và mỗi API thay đổi nó thế nào.

---

## 3. Ghép Redux Slice Với API
Với mỗi slice trong `src/features/*/*Slice.js`:
1. **Xác định `initialState`**, action creator, selector quan trọng.
2. **Lần theo async thunk** đến API tương ứng:
   - `fetchWorkspaces` → `api.workspaces.list`
   - `createTeamMember` → `api.auth.createUser` …
3. **Đọc `extraReducers`** để hiểu cách xử lý trạng thái pending/fulfilled/rejected.
4. **Ghi chú side-effect** (ví dụ refresh danh sách project khi task đổi, refresh user sau khi sửa team).

> ✅ Kết quả: bạn nắm luồng dữ liệu từ UI → API → Redux.

---

## 4. Routing & App Shell
### Các file chính:
- `src/App.jsx`
- `src/components/auth/RequireAuth.jsx`
- `src/layouts/MainLayout.jsx`

Các bước:
1. **`App.jsx`**: xem cách cấu hình route lazy load, boot dữ liệu ban đầu, cách `<RequireAuth>` bảo vệ trang.
2. **`RequireAuth`**: biết cơ chế chuyển hướng khi chưa đăng nhập và thông báo thiếu quyền.
3. **`MainLayout`**: quan sát layout chung:
   - Menu bên trái lọc theo quyền (`hasPermission`).
   - Toggle theme sáng/tối.
   - Header hiển thị người dùng, nút logout, tiêu đề động.

> ✅ Kết quả: bạn hiểu luồng điều hướng và quyết định UI/permission cấp toàn cục.

---

## 5. Đào Sâu Từng Trang
Lần lượt duyệt qua các file trong `src/pages`:

### Home (`HomePage.jsx`)
- Hiển thị thống kê tổng quan, danh sách task gần đây.
- Toggle trạng thái task bằng `updateTaskAsync`, lưu ý kiểm tra quyền.

### Workspaces (`WorkspacePage.jsx`)
- Điều khiển giao diện tìm kiếm, metrics, hoạt động gần đây.
- Sử dụng `WorkspaceList`, `CreateWorkspaceModal`, `EditWorkspaceModal`, `CreateProjectModal`.
- Chú ý selector với `useMemo` và cách cắt state theo workspace.

### Projects (`ProjectPage.jsx`)
- Render lưới project (`ProjectGrid`) + panel chi tiết.
- Gắn create/edit modal theo workspace hiện thời.

### Tasks (`TaskPage.jsx`)
- Tạo board Kanban (`TaskBoard` → `TaskColumn` → `TaskCard`).
- Có filter, modal tạo/sửa, hạn chế chức năng theo quyền.

### Team (`TeamPage.jsx`)
- Quản lý team theo vai trò (admin, manager, contributor).
- Kết hợp `AddTeamMemberModal`, `EditTeamMemberModal`, `ConfirmDialog` cho thao tác CRUD.

### Analytics (`AnalyticsPage.jsx` + `src/components/analytics/*`)
- Bảng điều khiển, biểu đồ Recharts dựa trên projects/tasks.

> ✅ Kết quả: bạn hiểu mỗi trang phối hợp dữ liệu, modal, component con để hoàn thiện tính năng.

---

## 6. Khám Phá Component Dùng Chung
### Thư mục quan trọng:
- `src/components/common`
- `src/components/<feature>/*.jsx`

Điểm cần chú ý:
1. **Button, Input, Dropdown, Modal**: xem pattern styling, trạng thái disabled, palette gradient.
2. **Component tái sử dụng** (vd `WorkspaceList`, `ProjectCard`, `TaskColumn`): hiểu props, memoization (`React.memo`, `useMemo`, `useCallback`), event handler.
3. **Modal của Team**: validation, xử lý lỗi, hạn chế quyền, `toast` feedback.

> ✅ Kết quả: bạn nắm cách UI cơ bản được kết hợp tùy biến ở từng module.

---

## 7. Bám Theo Quyền Hạn
Kiểm tra quyền xuất hiện ở nhiều lớp:
- `src/constants/permissions.js`: hằng số quyền + hàm trợ giúp.
- `src/hooks/usePermission.js`: gói logic lấy quyền từ state.
- Tại component: tìm `usePermission` (disable button, input read-only, ẩn section).
- API mock: đảm bảo `roleId` map đúng permission.

> Luôn so sánh mô hình quyền giữa dữ liệu API, Redux slice và UI để tránh lệch.

---

## 8. Kiểm Thử & Xác Thực
### File tham khảo:
- `src/features/__tests__/appFlows.test.js`
- `src/components/workspace/__tests__/WorkspaceList.test.jsx`
- `src/test-utils/renderWithProviders.jsx`

Các bước:
1. Hiểu `renderWithProviders` giúp render component kèm store như thế nào.
2. Xem bài test integration sử dụng mock API (đăng nhập, CRUD).
3. Khi thêm tính năng, hãy viết test theo pattern sẵn có để đảm bảo độ tin cậy.

> ✅ Kết quả: bạn biết cách kiểm chứng luồng chính và mở rộng test khi cần.

---

## 9. Mở Rộng & Debug
Khi thêm tính năng hoặc sửa lỗi:
1. **Thiết kế dữ liệu** ở `mockApi.js` trước, đảm bảo thunk nhận dạng chính xác.
2. **Cập nhật slice** với action mới, xử lý state loading/error.
3. **Nối UI** – thêm component, form, check permission.
4. **Viết test** – cả slice và component nếu phù hợp.
5. **Dùng DevTools** – Redux DevTools, React DevTools, log API để theo dõi state & props.

---

## 10. Checklist Tóm Tắt
1. README & package.json  
2. Store reducers + slices  
3. Mock API  
4. Auth, permission, util  
5. App routing & layout  
6. Từng page + component con  
7. UI dùng chung  
8. Test & tooling  
9. Quy trình debug/mở rộng  

Lặp lại chu trình: xem tổng quan → đào sâu một feature → theo dõi dữ liệu/API → soi UI → kiểm thử. Mỗi vòng lặp giúp bạn hiểu sâu từng endpoint, slice và component trong ProjectHub.
