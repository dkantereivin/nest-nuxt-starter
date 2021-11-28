import { Args, Query, Resolver } from '@nestjs/graphql';
import { Help } from './help.model';
import { readFileSync } from 'fs';
import yaml from 'yaml';
import { join } from 'path';

@Resolver(() => Help)
export class HelpResolver {
    private helpEntries: Map<Help['name'], Help> = new Map();

    constructor() {
        const helpFile = readFileSync(
            join(process.cwd(), 'src/core/help/help.yaml'),
            'utf8'
        );
        const helpEntries = yaml.parse(helpFile);
        for (const name of Object.keys(helpEntries)) {
            this.helpEntries.set(name, helpEntries[name]);
        }
    }

    @Query(() => Help)
    help(
        @Args('name', {
            description: 'The name of the help entry to retrieve.',
            defaultValue: 'help'
        })
        name: string
    ): Help {
        return this.helpEntries.get(name) ?? this.helpEntries.get('commands');
    }
}
