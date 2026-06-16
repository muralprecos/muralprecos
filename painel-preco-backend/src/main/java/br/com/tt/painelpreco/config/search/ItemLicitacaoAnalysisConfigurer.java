package br.com.tt.painelpreco.config.search;

import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurationContext;
import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurer;

public class ItemLicitacaoAnalysisConfigurer implements LuceneAnalysisConfigurer {
    @Override
    public void configure(LuceneAnalysisConfigurationContext context) {
        context.analyzer("portuguese_analyzer").custom()
            .tokenizer("standard")
            .tokenFilter("lowercase")
            .tokenFilter("asciifolding")
            // Usa o factory padrão 'stop' para as stopwords customizadas e nativas.
            // O formato "snowball" garante que o arquivo portuguese_stop.txt seja parseado 
            // corretamente (ignorando os comentários com "|"). O arquivo customizado também
            // será lido de forma compatível.
            .tokenFilter("stop")
                .param("format", "snowball")
                .param("words", "custom_stopwords.txt,org/apache/lucene/analysis/snowball/portuguese_stop.txt")
                .param("ignoreCase", "true");
    }
}
