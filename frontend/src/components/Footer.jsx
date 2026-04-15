import { Zap } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Zap size={18} />
          <span>ShopAWS</span>
          <p>Enterprise ecommerce powered by AWS microservices.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Services</h4>
            <ul>
              <li>User Service (Cognito)</li>
              <li>Product Service (DynamoDB)</li>
              <li>Order Service (RDS)</li>
              <li>Payment Service (SQS)</li>
            </ul>
          </div>
          <div>
            <h4>Infrastructure</h4>
            <ul>
              <li>EKS + Kubernetes</li>
              <li>Terraform IaC</li>
              <li>Prometheus + Grafana</li>
              <li>Loki Logging</li>
            </ul>
          </div>
          <div>
            <h4>DevOps</h4>
            <ul>
              <li>GitHub Actions CI/CD</li>
              <li>ArgoCD GitOps</li>
              <li>Docker + ECR</li>
              <li>GPU Scheduling</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 ShopAWS — AWS Enterprise Ecommerce Platform</p>
        </div>
      </div>
    </footer>
  )
}