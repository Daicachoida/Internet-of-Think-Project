import { Github, Globe, Zap, FileText } from 'lucide-react';
import type { ProfileResourceItem } from './type';

export const PROFILE_RESOURCES: ProfileResourceItem[] = [
  {
    title: 'GitHub Repository',
    desc: 'Mã nguồn toàn bộ dự án',
    url: 'https://github.com/nguyenanhtu/iot-webapp',
    icon: Github,
  },
  {
    title: 'Figma UI Design',
    desc: 'Bản vẽ thiết kế giao diện Dashboard',
    url: 'https://figma.com/@nguyenanhtu/iot-ui',
    icon: Globe,
  },
  {
    title: 'Postman API Docs',
    desc: 'Tài liệu đặc tả các RESTful Endpoints',
    url: 'https://documenter.getpostman.com/view/iot-apis',
    icon: Zap,
  },
  {
    title: 'Báo cáo đồ án (PDF)',
    desc: 'File tài liệu báo cáo toàn văn',
    url: 'https://example.com/Bao_Cao_IoT_NguyenAnhTu.pdf',
    icon: FileText,
  },
];
