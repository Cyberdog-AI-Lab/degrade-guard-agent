##
# Web ティア用セキュリティグループ（IaC / Terraform サンプル）
#
# 宣言的リソース。複数のイングレスルールが共存しており、
# 1つのルールを変更したときに「他のルール（許可範囲）が意図せず緩まないか」を
# 机上でデグレチェックする対象。
#
# デグレの起きどころ例:
#   - SSH の cidr_blocks を変えたつもりが、他ルールの範囲も広げてしまう
#   - protocol / port の指定ミスで想定外のポートが開く
##

variable "vpc_id" {
  type        = string
  description = "配置先 VPC"
}

variable "bastion_cidr" {
  type        = string
  description = "SSH を許可する踏み台の CIDR"
  default     = "10.0.1.0/24"
}

resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Web tier security group"
  vpc_id      = var.vpc_id

  # HTTPS: 全世界から許可
  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP: 全世界から許可（HTTPS へのリダイレクト用）
  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH: 踏み台からのみ許可
  ingress {
    description = "SSH from bastion only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.bastion_cidr]
  }

  # アウトバウンド: 全許可
  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-sg"
    Tier = "web"
  }
}
