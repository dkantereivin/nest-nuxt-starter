import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sg from '@sendgrid/mail';
import { pathTo } from '@/common/utils/files';
import { readFileSync } from 'fs';
import yaml from 'yaml';
import { TemplateException } from '@/common/services/mail/mail.exceptions';
import { assertOrThrow } from '@/common/utils/logic';

type Template = {
    templateName: string;
    templateId: string;
    from: 'default' | string;
    environments: string[];
    data?: string[];
};

@Injectable()
export class MailService {
    constructor(private config: ConfigService) {
        sg.setApiKey(this.config.get<string>('mail.apiKey'));
    }

    async sendTemplate(name: string, to: string, data: Record<string, string> = {}): Promise<void> {
        const template = this.getTemplateByName(name);
        assertOrThrow(!!template, new TemplateException(`Template ${name} not found`));

        template.data?.forEach((key) =>
            assertOrThrow(
                !!data[key],
                new TemplateException(`Template ${name} requires data ${key}`)
            )
        );

        const env = this.config.get<string>('app.env');
        assertOrThrow(
            template.environments.includes(env),
            new TemplateException(`Template ${name} not available in ${env}`)
        );

        await sg.send({
            to,
            templateId: template.templateId,
            from:
                template.from === 'default' ? this.config.get<string>('mail.from') : template.from,
            dynamicTemplateData: data
        });
    }

    private getTemplateByName(
        name: string,
        path = pathTo('common/services/mail/templates.yaml')
    ): Template | undefined {
        const templates: Template[] = yaml.parse(readFileSync(path, 'utf8'));
        return templates.find((template) => template.templateName === name);
    }
}
