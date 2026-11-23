# Request for authorized HCMC public-transport data access

**Project:** Mercury Plus — public non-commercial HCMC browser pilot  
**Status:** Draft only. This request has not been sent.  
**Suggested recipient:** contact@golabs.vn  
**Optional technical contact:** thanh@golabs.vn  
**Public service feedback route:** 1022 (press 9), for referral only — not an API support channel.

## Vietnamese version

**Tiêu đề:** Đề nghị cung cấp thông tin và quyền tích hợp dữ liệu xe buýt công cộng TP.HCM vào bản đồ Mercury Plus

Kính gửi Công ty Cổ phần Công nghệ Go Labs và đơn vị quản lý dữ liệu giao thông công cộng TP. Hồ Chí Minh,

Chúng tôi đang phát triển Mercury Plus, một bản đồ web công khai, phi thương mại dành cho Thành phố Hồ Chí Minh. Mục đích là hiển thị thông tin giao thông công cộng có nguồn gốc rõ ràng cho người dân. Dự án không thu phí, không quảng cáo và không bán dữ liệu.

Chúng tôi được biết MultiGo cung cấp tra cứu tuyến xe buýt và thời gian xe đến trạm dựa trên dữ liệu cập nhật của hệ thống xe buýt thành phố. Trước khi tích hợp bất kỳ dữ liệu nào vào Mercury Plus, kính đề nghị Quý đơn vị hướng dẫn và xác nhận các nội dung sau:

1. **Nguồn dữ liệu chính thức:** Có thể cung cấp GTFS (lịch trình/tuyến/trạm), GTFS-Realtime, SIRI, API REST, WebSocket hoặc định dạng chính thức nào khác cho bên thứ ba hay không?
2. **Vị trí xe và ETA:** Có thể cấp quyền hiển thị vị trí GPS của xe buýt, thời điểm ghi nhận GPS, thời gian dự kiến đến trạm, tuyến, trạm dừng và thông báo dịch vụ trên bản đồ công khai không?
3. **Quyền sử dụng:** Có được phép hiển thị dữ liệu trong website bên thứ ba công khai, phi thương mại và gửi phản hồi dữ liệu đến trình duyệt người dùng hay không? Có hợp đồng, văn bản chấp thuận hoặc điều khoản giấy phép cần ký không?
4. **Giới hạn kỹ thuật:** Yêu cầu API key/OAuth, IP hoặc domain allowlist, giới hạn request, tần suất làm mới, chính sách cache và thời gian lưu dữ liệu là gì?
5. **Nguồn và ghi công:** Cần ghi tên MultiGo, Go Labs, Trung tâm Quản lý Giao thông công cộng hay cơ quan nào? Cần hiển thị liên kết và tuyên bố miễn trừ trách nhiệm nào?
6. **Độ mới và độ chính xác:** Dữ liệu có timestamp GPS và timestamp máy chủ riêng không? Khi xe mất tín hiệu hoặc dữ liệu cũ, trạng thái nào phải được hiển thị?
7. **Chủ sở hữu dữ liệu:** Nếu Go Labs không phải đơn vị có thẩm quyền cấp phép dữ liệu vị trí xe, kính mong chỉ rõ cơ quan/đơn vị quản lý dữ liệu và đầu mối phụ trách.

Mercury Plus chỉ cần dữ liệu vận hành phương tiện công cộng: tuyến, điểm dừng, vị trí phương tiện, giờ dự kiến đến và thông báo dịch vụ. Chúng tôi không yêu cầu và không thu thập dữ liệu cá nhân của hành khách, vị trí thiết bị người dùng, thông tin tài xế hoặc lịch sử hành trình cá nhân.

Chúng tôi cam kết không truy cập trái phép, không giải mã giao thức riêng tư, không trích xuất token từ ứng dụng di động và không thu thập dữ liệu bằng cách phân tích lưu lượng ứng dụng. Chỉ tích hợp nguồn dữ liệu được Quý đơn vị chính thức cho phép.

Nếu có thể, kính đề nghị cung cấp tài liệu API, quy trình đăng ký và điều khoản sử dụng dành cho dự án phi thương mại.

Trân trọng,

**Nhóm dự án Mercury Plus**  
Bản đồ thông tin giao thông phi thương mại dành cho Thành phố Hồ Chí Minh

---

## English version

**Subject:** Request for authorized HCMC public-transport data access for the Mercury Plus map

Dear Go Labs Technology JSC and the authorized Ho Chi Minh City public-transport data operator,

We are developing Mercury Plus, a public, non-commercial web map for Ho Chi Minh City. Its purpose is to display clearly sourced public-transport information for residents. The pilot has no subscriptions, advertising or data resale.

We understand that MultiGo provides bus-route lookup and estimated vehicle arrivals using current data from the city's bus system. Before integrating any data into Mercury Plus, we respectfully request guidance on the following:

1. **Official data source:** Is a GTFS static package, GTFS-Realtime, SIRI feed, REST API, WebSocket or another documented third-party data interface available?
2. **Vehicle positions and ETA:** May a public third-party map display bus GPS positions, GPS observation timestamps, estimated arrivals, routes, stops and service alerts?
3. **Reuse rights:** Is display in a public, non-commercial third-party website and delivery to visitors' browsers permitted? Is a written agreement, authorization letter or licence required?
4. **Technical limits:** What are the authentication, API key/OAuth, IP/domain allowlisting, request quotas, refresh cadence, caching and retention requirements?
5. **Attribution:** Which agency/operator names, links, copyright statements and disclaimers must be displayed?
6. **Freshness and accuracy:** Are GPS-observation and server-ingestion timestamps available separately? What status should be used when a vehicle loses signal or its position becomes stale?
7. **Data ownership:** If Go Labs is not the party authorized to grant these rights, please identify the data owner/operator and the appropriate contact.

Mercury Plus needs operational public-transport data only: routes, stops, vehicle positions, estimated arrivals and service notices. We do not request or collect passenger personal data, user-device locations, driver identities or personal journey histories.

We will not access restricted systems, reverse engineer private protocols, extract tokens from the mobile app, or inspect app network traffic to obtain data. We will integrate only a source officially authorized by the data owner/operator.

Please provide the relevant API documentation, registration process and non-commercial-use terms, if available.

Sincerely,

**Mercury Plus Project Team**  
Public non-commercial traffic information map pilot for Ho Chi Minh City

---

## Sending and follow-up checklist

- Send to `contact@golabs.vn`; optionally copy `thanh@golabs.vn`.
- Ask Go Labs to identify the authorized public-transport data owner if it is not the rights holder.
- The 1022 (press 9) public-service line is published for service feedback; use it only to ask for the correct data-access office, not to obtain credentials.
- Keep written approval, data terms and technical instructions in the project repository.
- Do not activate the vehicle layer before the rights and feed contract are explicit.
