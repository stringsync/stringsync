import { $gql, CreateNotationInput, CreateNotationOutput, t } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';

const CREATE_NOTATION_GQL = $gql
  .mutation('createNotation')
  .setQuery({
    ...t.union<CreateNotationOutput>()({
      Notation: {
        id: t.string,
      },
      ForbiddenError: {
        message: t.string,
      },
      ValidationError: {
        details: [t.string],
      },
      UnknownError: {
        message: t.string,
      },
    }),
  })
  .setVariables<{ input: CreateNotationInput }>({
    input: {
      artistName: t.string,
      songName: t.string,
      tagIds: [t.string],
      thumbnail: t.file,
      video: t.file,
    },
  })
  .build();

export const useCreateNotation = (opts: UseGqlOptions<typeof CREATE_NOTATION_GQL>) => {
  return useGql(CREATE_NOTATION_GQL, opts);
};
