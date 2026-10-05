import React from "react";
import { CheckCircle, Sparkle } from "@phosphor-icons/react";
import { Card } from "../../../../components/ui/card/Card";
import { Button } from "../../../../components/ui/button/Button";
import { Avatar } from "../../../../components/ui/avatar/Avatar";
import { Badge } from "../../../../components/ui/badge/Badge";

/**
 * Màn hình chúc mừng sau khi hoàn tất hồ sơ
 */
export default function StepSuccessCelebration({
  formData,
  avatarPreview,
  onFinish,
}) {
  return (
    <Card className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
      <div className="relative inline-block mx-auto">
        <Avatar
          src={avatarPreview}
          name={formData.fullName || "User"}
          size="xl"
          className="size-24 border-2 border-primary mx-auto"
        />
        <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-success text-white border-2 border-surface-main flex items-center justify-center">
          <CheckCircle size={18} weight="bold" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <Sparkle size={14} weight="fill" />
          <span>Hồ sơ đã sẵn sàng</span>
        </div>

        <h2 className="text-2xl font-black text-text-main tracking-tight">
          Chào mừng, {formData.fullName}!
        </h2>

        <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
          Tài khoản của bạn đã được thiết lập đầy đủ. Hãy bắt đầu khám phá bảng tin
          và kết nối với những người bạn mới.
        </p>

        {(formData.occupation || formData.city?.name) && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {formData.occupation && (
              <Badge variant="subtle" size="sm">
                {formData.occupation}
              </Badge>
            )}
            {formData.city?.name && (
              <Badge variant="subtle" size="sm">
                {formData.city.name}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onFinish}
        >
          Bắt đầu khám phá ngay
        </Button>
      </div>
    </Card>
  );
}
