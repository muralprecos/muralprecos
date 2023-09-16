package br.com.tt.painelpreco.util;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.util.StringUtils;

import br.com.tt.painelpreco.arch.exception.ArchException;

@SuppressWarnings("unchecked")
public class ReflectionUtil {
	
	public static Field[] getFields(Class<?> clazz) {
		Field[] fields = clazz.getDeclaredFields();
		Field[] fieldsSuperClass = clazz.getSuperclass().getDeclaredFields();
		
		List<Field> allFields = new ArrayList<>();
		allFields.addAll(Arrays.asList(fields));
		allFields.addAll(Arrays.asList(fieldsSuperClass));
		
		return allFields.toArray(new Field[allFields.size()]);
	}
	
	public static Field[] getFieldsByType(Class<?> clazz, Class<?> type) {
		List<Field> result = new ArrayList<>();
		for (Field field : getFields(clazz)) {
			Class<?> typeField = field.getType();
			Class<?> superClassType = typeField.getSuperclass();
			if (typeField.equals(type) || superClassType.equals(type))
				result.add(field);
		}
		
		return result.toArray(new Field[result.size()]);
	}
	
	public static Field[] getFieldsByType(Object obj, Class<?> type) {
		try {
			return getFieldsByType(obj.getClass(), type);
		} catch (NullPointerException e) {
			return new Field[0];
		}
	}
	
	public static Optional<Field> getField(Class<?> clazz, String fieldName) {
		Field[] fields = getFields(clazz);
		for (Field field : fields) {
			if (field.getName().equals(fieldName))
				return Optional.of(field);
		}
		return Optional.ofNullable(null);
	}
	
	public static Class<?> getTypeField(Class<?> clazz, String fieldName) {
		Optional<Field> field = getField(clazz, fieldName);
		if (field.isPresent())
			return field.get().getType();
		
		throw new ArchException(String.format("\"Field\" %s não encontrado na classe %s", fieldName, clazz.getSimpleName()));
	}
	
	public static Optional<Method> getMethod(Class<?> clazz, String methodName, Object...args) {
		Method method = null;
		try {
			Class<?>[] typeArgs = getTypeArgs(args);
			method = clazz.getMethod(methodName, typeArgs);
		} catch (NoSuchMethodException | SecurityException e) {
			new ArchException(String.format("Método %s não encontrado na classe %s", methodName, clazz.getSimpleName()), e);
		}
		return Optional.ofNullable(method);
	}

	private static Class<?>[] getTypeArgs(Object... args) {
		List<Class<?>> types = new ArrayList<>();
		for (Object object : args) {
			Class<?> clazzType = object.getClass();
			types.add(clazzType);
		}
		
		return types.toArray(new Class<?>[0]);
	}
	
	public static <T> T invokeMethod(Object obj, String methodName, Object...args) {
		Class<?> clazz = obj.getClass();
		Optional<Method> method = getMethod(clazz, methodName, args);
		T result = null;
		try {
			if (method.isPresent())
				result = (T) method.get().invoke(obj, args);
		} catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
			throw new ArchException(String.format("Ocorreu um erro ao executar o método %s do objeto da classe %s", methodName, clazz.getSimpleName()), e);
		}
		return result;
	}
	
	private static String getAcessorMethodName(String fieldName) {
		return "get" + StringUtils.capitalize(fieldName);
	}
	
	private static String getModifierMethodName(String fieldName) {
		return "set" + StringUtils.capitalize(fieldName);
	}
	
	public static <T> T invokeAcessorMethod(Object obj, String fieldName) {
		return (T) invokeMethod(obj, getAcessorMethodName(fieldName));
	}
	
	public static <T> T invokeAcessorMethod(Object obj, Field field) {
		return (T) invokeAcessorMethod(obj, field.getName());
	}
	
	public static <T> T invokeModifierMethod(Object obj, String fieldName, Object arg) {
		return (T) invokeMethod(obj, getModifierMethodName(fieldName), arg);
	}
	
	public static <T> T invokeAcessorMethod(Object obj, Field field, Object arg) {
		return (T) invokeModifierMethod(obj, field.getName(), arg);
	}
	
	public static <T> T loadClass(String canonicalNameClass) {
		try {
			return (T) ReflectionUtil.class.getClassLoader().loadClass(canonicalNameClass);
		} catch (Exception e) {
			throw new ArchException("Ocorreu um erro carregar a class " + canonicalNameClass + ". " + e.getMessage());
		}
	}
	
	public static <T> T newInstance(Class<?> clazz) {
		try {
			return (T) clazz.getDeclaredConstructor().newInstance();
		} catch (Exception e) {
			throw new ArchException("Ocorreu um erro inicializar a class " + clazz.getName() + ". " + e.getMessage());
		}
	}
	
	public static <T> T newInstance(String canonicalNameClass) {
		Class<T> clazz = loadClass(canonicalNameClass);
		return (T) newInstance(clazz);
	}

}
