# Kiến trúc CI/CD Zero-Trust DevSecOps

## Giai đoạn 1: Bảo mật mã nguồn và môi trường chạy
- **Gitleaks** phát hiện bí mật bị lộ trong kho lưu trữ.
- **8-Gate DLP** kiểm tra nội dung, regex, phân loại, ngăn chặn exfiltration, mã hóa dữ liệu, quét mối đe dọa.
- **Harden-Runner** giảm quyền OS, biệt lập môi trường chạy, loại bỏ các thành phần không cần thiết.

## Giai đoạn 2: Phân tích tĩnh mã nguồn (SAST)
- **gosec** kiểm tra các lỗ hổng bảo mật Go phổ biến.
- **govulncheck** quét các thành phần Go bị ảnh hưởng.
- **Semgrep** kiểm tra tự động dựa trên mẫu.
- **go test -race** phát hiện các vấn đề về đua chạy.

## Giai đoạn 3: Xác minh tính toàn vẹn và giao diện người dùng
- **SHA-384 SRI Verifier** xác minh các tài nguyên được tải vào từ CDN.
- **Headless Chrome Visual/Spatial Gate** kiểm tra giao diện người dùng, khoảng cách, vị trí, nhật ký lỗi console.

## Giai đoạn 4: Xây dựng container an toàn
- **Distroless Container** chỉ chứa runtime, giảm diện tích tấn công.
- **Trivy** quét các lỗ hổng trong image.
- **CycloneDX SBOM** tạo SBOM để theo dõi thành phần.

## Giai đoạn 5: Kiểm tra động (DAST)
- **OWASP ZAP** kiểm tra động trang web đang chạy.
- **g8s-sec-gate** cổng kiểm tra bảo mật dựa trên Kubernetes.

## Giai đoạn 6: Tuân thủ nguồn gốc và triển khai nguyên tử
- **SLSA Provenance** tạo nguồn gốc có thể kiểm chứng cho các sản phẩm đã xây dựng.
- **Atomic Pull-GitOps Rollback** triển khai GitOps nguyên tử, có thể hoàn tác tức thì.

→ Bỏ qua các lớp trừu tượng không cần thiết. Thêm các bước nâng cao khi các mối đe dọa mới xuất hiện.
