import {
  DocumentNode,
  OperationDefinitionNode,
  NameNode,
  OperationTypeNode,
} from 'graphql';

class InvalidDocError extends Error {
  constructor(doc: DocumentNode) {
    super(`invalid doc: ${JSON.stringify(doc)}`);
  }
}

export class DocNodeAnalyzer {
  public static getOperationType(doc: DocumentNode): OperationTypeNode {
    return DocNodeAnalyzer.getOperationDefinitionNode(doc).operation;
  }

  public static getResolverName(doc: DocumentNode): string {
    return DocNodeAnalyzer.getResolverNameNode(doc).value;
  }

  private static getOperationDefinitionNode(
    doc: DocumentNode
  ): OperationDefinitionNode {
    if (doc.definitions.length !== 1) {
      throw new InvalidDocError(doc);
    }
    const definition = doc.definitions[0];
    if (definition.kind !== 'OperationDefinition') {
      throw new InvalidDocError(doc);
    }
    return definition;
  }

  private static getResolverNameNode(doc: DocumentNode): NameNode {
    const { selections } = DocNodeAnalyzer.getOperationDefinitionNode(
      doc
    ).selectionSet;
    if (selections.length !== 1) {
      throw new InvalidDocError(doc);
    }
    const selection = selections[0];
    if (selection.kind !== 'Field') {
      throw new InvalidDocError(doc);
    }
    if (selection.name.kind !== 'Name') {
      throw new InvalidDocError(doc);
    }
    return selection.name;
  }
}
