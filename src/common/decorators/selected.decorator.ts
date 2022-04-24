import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Selected = createParamDecorator(
    (_: never, context: ExecutionContext): Record<string, boolean> => {
        const info = GqlExecutionContext.create(context).getInfo();
        const selections = info.operation.selectionSet.selections[0].selectionSet.selections;
        const fields = selections.map((selection) => selection.name.value);
        const selection = {};
        fields.forEach((field) => {
            selection[field] = true;
        });
        return selection;
    }
);
