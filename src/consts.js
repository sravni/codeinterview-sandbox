const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  GO: 'go',
  CSHARP: 'csharp',
//   SWIFT: 'swift'
}

const LANGUAGE_EXECUTE_PARAMETERS = {
  [LANGUAGES.JAVASCRIPT]: {
    executeString: 'node code.js',
    fileName: 'code.js'
  },
  [LANGUAGES.TYPESCRIPT]: {
    executeString: 'ts-node code.ts',
    fileName: 'code.ts'
  },
  [LANGUAGES.GO]: {
    executeString: 'go run code.go',
    fileName: 'code.go'
  },
  [LANGUAGES.CSHARP]: {
    executeString: 'cp ../../Csharp.csproj CsharpProject.csproj && dotnet run --nologo',
    fileName: 'Program.cs'
  },
//   [LANGUAGES.SWIFT]: ['swift', 'file.swift', ''],
}

module.exports.LANGUAGES = LANGUAGES
module.exports.LANGUAGE_EXECUTE_PARAMETERS = LANGUAGE_EXECUTE_PARAMETERS