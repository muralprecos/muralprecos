package br.com.tt.painelpreco.llm.api;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import br.com.tt.painelpreco.llm.api.dto.ChatCompletionRequest;
import br.com.tt.painelpreco.llm.api.dto.ChatCompletionResponse;
import br.com.tt.painelpreco.llm.config.LlmFeignConfiguration;

/**
 * Cliente neutro de provedor de LLM: qualquer API compatível com o formato de
 * Chat Completions da OpenAI (a própria OpenAI, DeepSeek, etc.) funciona sem
 * mudança de código — só trocando llm.api.base-url/model/key.
 */
@FeignClient(name = "llm", url = "${llm.api.base-url}", configuration = LlmFeignConfiguration.class)
public interface LlmClient {

	@PostMapping("/chat/completions")
	ChatCompletionResponse createChatCompletion(
			@RequestHeader("Authorization") String bearerToken,
			@RequestBody ChatCompletionRequest request);

}
