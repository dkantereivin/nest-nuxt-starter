// return a string of the fields list in sentence form
// seperate via comma and end with , and
export function offendingFields(fields: string[]): string {
    if (fields.length === 0) return '';
    else if (fields.length === 1) return fields[0];
    const last = fields.pop();
    return `${fields.join(', ')} and ${last}`;
}
