#pragma once

#include <emscripten/bind.h>
#include <ranges>

namespace emscripten::internal {
template <typename T, typename Allocator>
struct BindingType<std::vector<T, Allocator>> {
	using WireType = BindingType<val>::WireType;

	static auto toWireType(std::vector<T, Allocator> const &vec) -> WireType {
		return BindingType<val>::toWireType(val::array(std::vector<val>(vec.begin(), vec.end())));
	}

	static auto fromWireType(WireType const value) -> std::vector<T, Allocator> {
		return vecFromJSArray<T>(BindingType<val>::fromWireType(value));
	}
};

template <typename T>
struct TypeID<T, typename std::enable_if_t<std::is_same_v<typename Canonicalized<T>::type, std::vector<typename Canonicalized<T>::type::value_type, typename Canonicalized<T>::type::allocator_type>>>> {
	static constexpr auto get() -> TYPEID {
		return TypeID<val>::get();
	}
};

template <typename Key, typename T, typename Compare, typename Allocator>
struct BindingType<std::map<Key, T, Compare, Allocator>> {
	using WireType = BindingType<val>::WireType;

	static auto toWireType(std::map<Key, T, Compare, Allocator> const &map) -> WireType {
		val js_value {val::object()};
		for (auto const &[k, v] : map) {
			js_value.set(k, v);
		}
		return BindingType<val>::toWireType(js_value);
	}

	static auto fromWireType(WireType const value) -> std::map<Key, T, Compare, Allocator> {
		val const entries {val::global("Object").call<val>("entries", BindingType<val>::fromWireType(value))};
		size_t const entries_length = entries["length"].as<size_t>();
		std::map<Key, T, Compare, Allocator> map {};
		for (size_t i = 0; i < entries_length; ++i) {
			map.emplace(entries[i][0].as<Key>(), entries[i][1].as<T>());
		}
		return map;
	}
};

template <typename T>
struct TypeID<T, typename std::enable_if_t<std::is_same_v<typename Canonicalized<T>::type, std::map<typename Canonicalized<T>::type::key_type, typename Canonicalized<T>::type::mapped_type, typename Canonicalized<T>::type::key_compare, typename Canonicalized<T>::type::allocator_type>>>> {
	static constexpr auto get() -> TYPEID {
		return TypeID<val>::get();
	}
};
}