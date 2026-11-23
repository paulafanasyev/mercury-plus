# Request for permission to display HCMC traffic-camera imagery

**Purpose:** public, non-commercial browser pilot — Mercury Plus  
**Project scope:** Ho Chi Minh City, Vietnam only  
**Official portal:** https://giaothong.hochiminhcity.gov.vn/Map.aspx

This document is a draft for review and sending by the project owner. It has not been sent.

## Vietnamese version

**Tiêu đề:** Đề nghị hướng dẫn và chấp thuận hiển thị hình ảnh camera giao thông công khai trong dự án phi thương mại Mercury Plus

Kính gửi Trung tâm Quản lý điều hành giao thông đô thị,

Chúng tôi đang phát triển Mercury Plus, một dự án bản đồ thông tin giao thông dạng web, phi thương mại, phục vụ mục đích tham khảo thông tin công khai tại Thành phố Hồ Chí Minh. Dự án không thu phí, không quảng cáo, không bán dữ liệu và không phải là dịch vụ ứng cứu khẩn cấp.

Chúng tôi được biết Cổng thông tin giao thông Thành phố Hồ Chí Minh (https://giaothong.hochiminhcity.gov.vn/Map.aspx) cung cấp hình ảnh từ các camera giao thông để người dân tham khảo.

Kính đề nghị Trung tâm hướng dẫn và xác nhận bằng văn bản các nội dung sau trước khi chúng tôi tích hợp bất kỳ hình ảnh hoặc luồng camera nào vào Mercury Plus:

1. **Danh mục và siêu dữ liệu:** Mercury Plus có được phép hiển thị tên camera, mã camera, vị trí/toạ độ và trạng thái hoạt động lấy từ danh mục công khai của Cổng hay không? Có API hoặc tệp dữ liệu chính thức được khuyến nghị sử dụng không?
2. **Ảnh chụp camera:** Có được phép nhúng trực tiếp hình ảnh JPEG do máy chủ chính thức cung cấp vào giao diện web công khai của một dự án phi thương mại bên thứ ba hay không? Có cần đăng ký, xin cấp quyền, giới hạn tên miền hoặc xác thực hay không?
3. **Luồng video HLS:** Với những camera có luồng video, việc phát trực tiếp trong trình phát trên website bên thứ ba có được cho phép không? Những giao thức và máy chủ nào được phép sử dụng?
4. **Tần suất và tải:** Tần suất làm mới ảnh được phép là bao nhiêu? Có giới hạn số camera được mở đồng thời, giới hạn số yêu cầu, thời gian lưu đệm hoặc quy tắc chống tải lớn nào không?
5. **Lưu trữ và phân phối lại:** Mercury Plus có được phép lưu tạm ảnh trong bộ nhớ đệm của trình duyệt hoặc máy chủ hay không? Có được phép lưu ảnh, tạo ảnh thu nhỏ, proxy, chuyển mã hoặc phân phối lại không? Nếu không, chúng tôi sẽ chỉ yêu cầu trực tiếp từ máy chủ chính thức khi người dùng mở một camera.
6. **Ghi nguồn:** Cần hiển thị tên cơ quan, dòng bản quyền, logo, liên kết nguồn hoặc tuyên bố miễn trừ trách nhiệm nào?
7. **Phạm vi và thời hạn:** Quyền (nếu được cấp) áp dụng cho toàn bộ camera công khai hay chỉ một số camera cụ thể? Có điều kiện về thời hạn, thu hồi quyền hoặc quy trình gỡ bỏ nội dung không?
8. **Quy định riêng tư:** Có yêu cầu kỹ thuật hoặc quy định nào về việc chỉ hiển thị hình ảnh tham khảo giao thông và không phân tích/nhận dạng khuôn mặt, biển số, không nhận diện hoặc theo dõi cá nhân không?

Mercury Plus cam kết không triển khai nhận dạng khuôn mặt, nhận dạng biển số, nhận diện cá nhân hoặc theo dõi hành trình của bất kỳ cá nhân nào. Chúng tôi không có nhu cầu truy cập camera riêng tư, camera nội bộ hoặc các luồng không được công khai. Chúng tôi cũng sẽ không vượt qua biện pháp bảo vệ, giới hạn truy cập hoặc điều kiện kỹ thuật của Cổng.

Nếu Trung tâm không phải đơn vị có thẩm quyền cấp phép cho việc nhúng hình ảnh, kính mong Trung tâm chuyển hướng dẫn hoặc cung cấp đầu mối của đơn vị sở hữu dữ liệu và người có thẩm quyền xác nhận.

Chúng tôi sẵn sàng cung cấp bản mô tả giao diện, tên miền triển khai, sơ đồ kỹ thuật và phương án ghi nguồn để Trung tâm xem xét.

Trân trọng,

**Nhóm dự án Mercury Plus**  
Dự án bản đồ thông tin giao thông phi thương mại dành cho Thành phố Hồ Chí Minh

---

## English version

**Subject:** Request for guidance and permission to display public HCMC traffic-camera imagery in the non-commercial Mercury Plus pilot

Dear Urban Traffic Management and Operations Center,

We are developing Mercury Plus, a public, non-commercial web map for informational use in Ho Chi Minh City. The pilot does not charge users, carry advertising, sell data, or operate as an emergency-response service.

We understand that the Ho Chi Minh City Traffic Information Portal (https://giaothong.hochiminhcity.gov.vn/Map.aspx) publishes images from traffic cameras for public reference.

Before integrating any camera imagery or video into Mercury Plus, we respectfully request written guidance on the following:

1. **Catalogue and metadata:** May Mercury Plus display camera names, IDs, coordinates/locations, and operational status from the public portal catalogue? Is there an official API or data file that third-party projects should use?
2. **Still images:** Is direct embedding of JPEG snapshots served by the official portal permitted in a public, non-commercial third-party website? Is registration, authorization, domain allowlisting, or authentication required?
3. **HLS video:** For cameras that expose video streams, may a third-party website play those streams in its own browser player? Which protocols and hostnames are approved?
4. **Refresh and load limits:** What snapshot refresh interval is permitted? Are there limits on concurrent cameras, request volume, polling frequency, or rate of access?
5. **Caching and redistribution:** May Mercury Plus use browser or server-side temporary caching? Are saving images, generating thumbnails, proxying, transcoding, framing, or redistributing media permitted? If not, we will request each image directly from the official host only when a user opens that camera.
6. **Attribution:** What agency name, copyright line, logo, source link, or disclaimer must be displayed?
7. **Scope and duration:** Would any authorization cover all publicly available cameras or only selected cameras? Are there duration, revocation, or takedown requirements?
8. **Privacy safeguards:** Are there technical or policy requirements for displaying imagery solely for traffic reference, without face recognition, number-plate recognition, personal identification, or individual tracking?

Mercury Plus will not implement face recognition, number-plate recognition, personal identification, or tracking of any individual. We do not seek access to private, internal, or non-public camera feeds. We will not bypass access controls, security measures, request limits, or technical restrictions on the portal.

If the Center is not the authorized rights holder or approval body for third-party embedding, we would appreciate referral to the relevant data owner or authorized department.

We can provide screenshots of the proposed interface, the deployment domain, a technical diagram, and the proposed attribution text for review.

Sincerely,

**Mercury Plus Project Team**  
Public non-commercial traffic information map pilot for Ho Chi Minh City

---

## Sending checklist

- Confirm that the published Center contact is still the correct recipient.
- Send the Vietnamese request first; include the English version as a convenience.
- Attach a screenshot of the camera panel and the proposed source/attribution treatment.
- Keep the written response and any technical conditions with the project's source audit.
- Do not enable camera imagery, HLS, proxying, or caching until the permission scope is explicit.
